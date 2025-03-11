def compute(cfg, inputDataFrame):

    # remove the columns we want to rename to avoid conflicts
    to_remove = [c for c in inputDataFrame.columns if c in cfg["columns"].values() and c not in cfg["columns"].keys()]
    inputDataFrame = inputDataFrame.drop(columns=to_remove)

    return inputDataFrame.rename(columns=cfg["columns"])

def dimensions(cfg, inputDataFrame):
    return list(cfg["columns"].keys())
