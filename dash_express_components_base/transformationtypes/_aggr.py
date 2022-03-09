def q01(x):
    return x.quantile(0.01)


def q05(x):
    return x.quantile(0.05)


def q25(x):
    return x.quantile(0.25)


def q75(x):
    return x.quantile(0.75)


def q95(x):
    return x.quantile(0.95)


def q99(x):
    return x.quantile(0.99)


def iqr(x):
    return x.quantile(0.75) - x.quantile(0.25)


def range(x):
    return x.max() - x.min()


aggr_func = {
    "q01": q01,
    "q05": q05,
    "q25": q25,
    "q75": q75,
    "q95": q95,
    "q99": q99,
    "iqr": iqr,
    "range": range
}


def compute(cfg, inputDataFrame):

    types = [aggr_func[t] if t in aggr_func else t for t in cfg["types"]]

    output = inputDataFrame.groupby(
        cfg["groupby"])[cfg["cols"]].agg(types).reset_index()
    output.columns = ["_".join([cc for cc in c if cc and cc != ""])
                      for c in output.columns]

    return output


def dimensions(cfg, inputDataFrame):
    return [
        *cfg["groupby"],
        *cfg["cols"]
    ]
