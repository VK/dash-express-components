import pandas as _pd


def compute(cfg, inputDataFrame):
    output = _pd.wide_to_long(inputDataFrame,
                            stubnames=cfg["stubnames"],
                            i=cfg["i"],
                            j=cfg["j"],
                            sep=cfg["sep"],
                            suffix= {"string": "\w+", "number": "\d+"}[cfg["suffix"]]
                            ).reset_index()

    return output


def dimensions(cfg, inputDataFrame):
    return [
        *cfg["i"],
        *[c for c in inputDataFrame.columns
          if cfg["sep"] in c and cfg["sep"].join(c.split(cfg["sep"])[:-1]) in cfg["stubnames"]
          ]
    ]
