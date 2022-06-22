import numpy as _np


def compute(cfg, inputDataFrame):

    # rename all columns with »
    trafo_cols = [c for c in inputDataFrame.columns if "»" in c]
    inputDataFrame.rename(
        columns={c: c.replace("»", "RightPointingDoubleAngle")
                 for c in trafo_cols},
        inplace=True
    )

    # rename all parts in the formula
    formula = cfg["formula"]
    for c in trafo_cols:
        new_c = c.replace("»", "RightPointingDoubleAngle")
        formula = formula.replace(c, new_c)

    var_dict = {
        "pi": _np.pi,
        "e": _np.e,
        "hbar": 6.58211951e-16,
        "c": 2.99792458e17,
        "hbar_c": 197.326979
    }

    inputDataFrame[cfg["col"]] = inputDataFrame.eval(
        formula, local_dict=var_dict, engine=None)
    # try:
    #     inputDataFrame[cfg["col"]] = inputDataFrame.eval(
    #         formula, local_dict=var_dict, engine='numexpr')
    # except:
    #     inputDataFrame[cfg["col"]] = inputDataFrame.eval(
    #         formula, local_dict=var_dict, engine='python')

    # make the back transformation
    inputDataFrame.rename(
        columns={c.replace("»", "RightPointingDoubleAngle"): c
                 for c in trafo_cols},
        inplace=True
    )

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return [c for c in inputDataFrame.columns if c in cfg["formula"]]
