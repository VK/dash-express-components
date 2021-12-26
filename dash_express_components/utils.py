from numpy import dtype
import pandas as _pd


def get_meta(df):
    """
    extract the metadata from a dataframe needed to hand over to the Filter
    """

    def parse(key, val):
        if isinstance(val, _pd.CategoricalDtype):
            return {
                "type": "categorical",
                "cat": val.categories.tolist()
            }
        elif val == dtype('O'):
            return {
                "type": "categorical",
                "cat": df[key].unique().tolist()
            }
        elif val == dtype('bool'):
            return {
                "type": "bool"
            }
        elif "time" in str(val):
            return {"type": "temporal", **df[key].agg(["median", "min", "max"]).T.to_dict()}
        else:
            return {"type": "numerical", **df[key].agg(["median", "min", "max"]).T.to_dict()}

    return {
        k: parse(k, val)
        for k, val in df.dtypes.to_dict().items()
    }