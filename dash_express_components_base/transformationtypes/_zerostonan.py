
def compute(cfg, inputDataFrame):
    import numpy as np

    for c in cfg["subset"]:
        inputDataFrame[c].replace(0.0, np.nan, inplace=True)

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return cfg["subset"]
