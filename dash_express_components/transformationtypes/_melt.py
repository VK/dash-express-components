import pandas as _pd


def compute(cfg, inputDataFrame):
    return _pd.melt(inputDataFrame,
                    id_vars=[
                        c for c in inputDataFrame.columns if c not in cfg["cols"]
                    ],
                    value_vars=cfg["cols"],
                    var_name=cfg["col2"], value_name=cfg["col"])


def dimensions(cfg, inputDataFrame):
    return cfg["cols"]
