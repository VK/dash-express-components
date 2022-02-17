def compute(cfg, inputDataFrame):
    return inputDataFrame.rename(columns=cfg["columns"])

def dimensions(cfg, inputDataFrame):
    return list(cfg["columns"].keys())
