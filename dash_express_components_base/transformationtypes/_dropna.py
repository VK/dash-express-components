

def compute(cfg, inputDataFrame):
    inputDataFrame = inputDataFrame.dropna(
        subset=cfg["subset"]
    )

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return cfg["subset"]
