
def _get(inputDataFrame, plotConfigData):

    data = inputDataFrame[plotConfigData["params"]["dimensions"]]

    # sort data if required    
    if "sort_values" in plotConfigData["params"]:
        ascending = True
        if "sort_values_ascending" in plotConfigData["params"]:
            ascending = plotConfigData["params"]["sort_values_ascending"]

        data.sort_values(by=plotConfigData["params"]["sort_values"], ascending=ascending, inplace=True)

    return data.to_dict("list")