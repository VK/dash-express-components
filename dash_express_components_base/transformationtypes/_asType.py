def compute(cfg, inputDataFrame):

    for k, v in cfg["values"].items():
        inputDataFrame[k] = inputDataFrame[k].astype(v)

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return list(cfg["values"].keys())
