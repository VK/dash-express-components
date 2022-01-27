

def compute(cfg, inputDataFrame):
    inputDataFrame[cfg["col"]] = inputDataFrame[
        cfg["incol"]
    ].replace(cfg["values"])

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return [cfg["incol"]]
