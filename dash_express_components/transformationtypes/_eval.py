import numpy as _np


def compute(cfg, inputDataFrame):
    var_dict = {
        "pi": _np.pi,
        "e": _np.e,
        "hbar": 6.58211951e-16,
        "c": 2.99792458e17,
        "hbar_c": 197.326979
    }
    inputDataFrame[cfg["col"]] = inputDataFrame.eval(
        cfg["formula"], local_dict=var_dict, engine='numexpr')

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return [c for c in inputDataFrame.columns if c in cfg["formula"]]
