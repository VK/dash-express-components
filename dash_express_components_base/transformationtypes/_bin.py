import pandas as _pd
import numpy as _np


def compute(cfg, inputDataFrame):

    # parameters in cfg
    # ============================
    # cols: one or more variable names. If there is a one dimensional binning, we can apply it multiple times
    # binning: the binning scheme
    # name: name of the output col
    # overlapping: if not overlapping -> single bin as result
    #              if overlapping     -> all bins are computed

    binning_df = _pd.DataFrame(cfg["binning"])

    # reduce the input cols to a simple string if the list is only filled with a single entry
    if isinstance(cfg["cols"], list) and len(cfg["cols"]) == 1:
        cfg["cols"] = cfg["cols"][0]

    if "min" in binning_df.columns:
        binning_df = binning_df.sort_values("min")
        # handle one dimensional
        if not cfg["overlapping"]:
            # simple binning of non overlapping bins
            bins = [*binning_df["min"].values.tolist(),
                    binning_df["max"].values[-1]]
            labels = [row["name"] for _, row in binning_df.iterrows()]

            # apply a multi col binning multiple import cols
            if isinstance(cfg["cols"], list):
                for c in cfg["cols"]:
                    inputDataFrame[f'{c}_{cfg["name"]}'] = _pd.cut(
                        inputDataFrame[c], bins=bins, labels=labels).astype(str)
            else:
                # apply a simple binning
                inputDataFrame[cfg["name"]] = _pd.cut(
                    inputDataFrame[cfg["cols"]], bins=bins, labels=labels).astype(str)

        else:
            # apply an overlapping binning scheme
            for _, bin in binning_df.iterrows():

                if isinstance(cfg["cols"], list):
                    for c in cfg["cols"]:
                        inputDataFrame[f'{c}_{cfg["name"]}_{bin["name"]}'] = (
                            inputDataFrame[c] >= bin["min"]) & (inputDataFrame[c] < bin["max"]).astype(str)
                else:
                    # apply a simple binning
                    inputDataFrame[f'{cfg["name"]}_{bin["name"]}'] = (
                        inputDataFrame[cfg["cols"]] >= bin["min"]) & (inputDataFrame[cfg["cols"]] < bin["max"]).astype(str)

    elif "points" in binning_df.columns:

        from shapely.geometry import Point as _Point
        from shapely.geometry.polygon import Polygon as _Polygon

        polygons = [_Polygon(el["points"]) for _, el in binning_df.iterrows()]
        labels = [row["name"] for _, row in binning_df.iterrows()]

        # handle multidimensional
        if not cfg["overlapping"]:
            # take first bin if non overlapping
            def get_bin(vals):
                p = _Point(vals)
                res = [poly.contains(p) for poly in polygons]
                idx = _np.argwhere(res)
                return labels[_np.min(idx)] if len(idx) > 0 else _np.nan

            inputDataFrame[cfg["name"]] = inputDataFrame[cfg["cols"]].apply(
                lambda x: get_bin(x), axis=1).astype(str)

        else:
            # apply a binning on every bin
            def get_bin(vals):
                p = _Point(vals)
                res = [poly.contains(p) for poly in polygons]
                return res

            inputDataFrame[[f'{cfg["name"]}_{l}' for l in labels]] = inputDataFrame[cfg["cols"]].apply(
                lambda x: get_bin(x), axis=1, result_type='expand').astype(str)

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    if isinstance(cfg["cols"], list):
        return cfg["cols"]
    else:
        return [cfg["cols"]]
