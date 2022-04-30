

def compute(cfg, inputDataFrame):

    if cfg["sep"] == "":
        inputDataFrame[cfg["col"]] = inputDataFrame[cfg["in"]
                                                    ].str.slice(start=cfg["start"], stop=cfg["end"])
    else:
        inputDataFrame[cfg["col"]] = inputDataFrame[cfg["in"]].str.split(
            pat=cfg["sep"]).map(lambda x: x[cfg["start"]])

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return cfg["in"]
