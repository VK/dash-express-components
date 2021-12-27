from numpy import dtype
import pandas as _pd
import numpy as _np
from datetime import datetime, timedelta
from dateutil import parser


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


def get_plot(df, config):
    print(config)
    if "filter" in config:
        for el in config["filter"]:
            col = el["col"]
            t = el["type"]
            if t == "isin":
                df = df[df[col].isin(el["value"])]
            elif t == "isnotin":
                df = df[~df[col].isin(el["value"])]
            elif t == "gt":
                df = df[df[col] > el["value"]]
            elif t == "gte":
                df = df[df[col] >= el["value"]]
            elif t == "lt":
                df = df[df[col] < el["value"]]
            elif t == "lte":
                df = df[df[col] <= el["value"]]
            elif t == "eq":
                df = df[df[col] == el["value"]]
            elif t == "neq":
                df = df[df[col] != el["value"]]
            elif t == "istrue":
                df = df[df[col]]
            elif t == "isfalse":
                df = df[~df[col]]
            elif t == "after":
                #df = df[df[col] > _pd.to_datetime(parser.isoparse(el["value"]))]
                df = df[df[col] > _pd.Timestamp(el["value"]).to_datetime64()]
            elif t == "before":
                #df = df[df[col] < _pd.to_datetime(parser.isoparse(el["value"]))]
                df = df[df[col] < _pd.Timestamp(el["value"]).to_datetime64()]
            elif t == "lastn":
                starttime = datetime.now() - timedelta(days=abs(el["value"]))
                df = df[df[col] > starttime]

    # if dask mongodf or pandas:
    df = df.copy()

    if "transform" in config:
        for el in config["transform"]:
            t = el["type"]
            if t == "eval":
                var_dict = {
                    "pi": _np.pi,
                    "e": _np.e,
                    "hbar": 6.58211951e-16,
                    "c": 2.99792458e17,
                    "hbar_c": 197.326979
                }
                df[el["col"]] = df.eval(
                    el["formula"], local_dict=var_dict, engine='numexpr')

            if t == "combinecat":
                df[el["col"]] = df[el["cols"]].apply(
                    lambda row: '_'.join(row.values.astype(str)), axis=1)

            if t == "melt":
                df = _pd.melt(df,
                              id_vars=[
                                  c for c in df.columns if c not in el["cols"]
                                  ],
                              value_vars=el["cols"],
                              var_name=el["col2"], value_name=el["col"])

    return df
