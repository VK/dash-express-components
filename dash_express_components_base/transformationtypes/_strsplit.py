

def compute(cfg, inputDataFrame):

    if cfg["sep"] == "":
        inputDataFrame[cfg["col"]] = inputDataFrame[cfg["in"]].fillna("").astype(str).str.slice(start=cfg["start"], stop=cfg["end"])
    else:

        output = inputDataFrame[cfg["in"]].fillna("").astype(str).str.split(pat=cfg["sep"])
        output = output.map(lambda x: x[cfg["start"]] if len(x) > cfg["start"] else "")

        inputDataFrame[cfg["col"]] = output

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return [cfg["in"]] if isinstance(cfg["in"], str) else cfg["in"]

