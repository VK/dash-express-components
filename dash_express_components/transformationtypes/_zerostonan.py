import numpy as np

def compute(cfg, inputDataFrame):

    for c in cfg["subset"]:
        inputDataFrame[c].replace(0.0, np.nan, inplace=True)

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return cfg["subset"]
