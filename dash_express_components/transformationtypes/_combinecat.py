

def compute(cfg, inputDataFrame):
    inputDataFrame[cfg["col"]] = inputDataFrame[cfg["cols"]].apply(
        lambda row: '_'.join(row.values.astype(str)), axis=1)

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return cfg["cols"]
