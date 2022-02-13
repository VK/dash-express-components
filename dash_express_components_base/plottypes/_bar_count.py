import pandas as _pd
import plotly.express as _px


def _get(inputDataFrame, plotConfigData):

    # daw a count plot
    x = plotConfigData["params"]["x"]
    groupParams = [x]

    # add color and facet entries to possible data groupings
    if "color" in plotConfigData["params"]:
        groupParams.append(plotConfigData["params"]["color"])
    if "facet_row" in plotConfigData["params"]:
        groupParams.append(
            plotConfigData["params"]["facet_row"])
    if "facet_col" in plotConfigData["params"]:
        groupParams.append(
            plotConfigData["params"]["facet_col"])
    groupParams = list(set(filter(None, groupParams)))

    # group data and count the entries of each group
    plotData = inputDataFrame.groupby(groupParams)[x].count()
    # transoform the data back to have a count entry for each group tuple
    plotData = _pd.DataFrame(plotData)
    plotData.rename(columns={x: "count"}, inplace=True)
    plotData.reset_index(inplace=True)
    plotConfigData["params"]["y"] = "count"

    # plot the data
    return _px.bar(plotData, **plotConfigData["params"])