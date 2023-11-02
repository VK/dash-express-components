
def compute(cfg, inputDataFrame):

    n = cfg["n"] if "n" in cfg else 10000
    cat_cols = cfg["groupby"] if "groupby" in cfg else []

    #num_cols = inputDataFrame._get_numeric_data().columns
    #cat_cols = list(set(inputDataFrame.columns) - set(num_cols))

    def downsample(x):
        if len(x) <= n:
            return x
        else:
            return x.sample(n=n, random_state=13)

    if len(cat_cols) > 0:
        inputDataFrame = inputDataFrame.groupby(cat_cols).apply(downsample).reset_index(drop=True)
    else:
        inputDataFrame = inputDataFrame.apply(downsample).reset_index(drop=True)

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return []
