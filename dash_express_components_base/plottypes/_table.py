
def _get(inputDataFrame, plotConfigData):

    data = inputDataFrame[plotConfigData["params"]["dimensions"]].to_dict("list")

    return data