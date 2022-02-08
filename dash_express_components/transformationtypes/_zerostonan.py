import numpy as np

def compute(cfg, inputDataFrame):

    print(inputDataFrame)

    for c in cfg["subset"]:
        inputDataFrame[c].replace(0.0, np.nan, inplace=True)

    print(inputDataFrame)

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return cfg["subset"]
