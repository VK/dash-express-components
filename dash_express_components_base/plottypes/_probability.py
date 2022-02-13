import plotly.graph_objects as _go
from scipy import stats as _stats
import pandas as _pd
import plotly.express as _px


def _get(inputDataFrame, plotConfigData):
    fig = _go.Figure()

    x = plotConfigData["params"]["x"]
    del plotConfigData["params"]["x"]

    showFit = False
    if "trendline" in plotConfigData["params"] and plotConfigData["params"]["trendline"] == "ols":
        showFit = True
        del plotConfigData["params"]["trendline"]

    groupParams = []
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

    def getProbPlot(groupData, grouped=True):
        res = _stats.probplot(groupData[x])
        if grouped:
            return _pd.Series({"Theoretical quantiles": res[0][0], "Percent": _stats.norm.cdf(res[0][0])*100.0, x: res[0][1], "Fit": res[0][0]*res[1][0] + res[1][1]})
        else:
            return _pd.DataFrame({"Theoretical quantiles": res[0][0], "Percent": _stats.norm.cdf(res[0][0])*100.0, x: res[0][1], "Fit": res[0][0]*res[1][0] + res[1][1]})

    if len(groupParams) > 0:
        plotData = inputDataFrame.groupby(groupParams).apply(
            lambda x: getProbPlot(x)).apply(_pd.Series.explode).reset_index()
    else:
        plotData = getProbPlot(inputDataFrame, False)

    # create the output plot
    
    plotConfigData["params"]["hover_data"] = ["Percent"]

    scatterPlot = _px.scatter(
        plotData, y="Theoretical quantiles", x=x,  **plotConfigData["params"])
    for d in scatterPlot.data:
        fig.add_trace(d)
    if showFit:
        for d in _px.line(plotData, y="Theoretical quantiles", x="Fit", **plotConfigData["params"]).data:
            d.showlegend = False
            fig.add_trace(d)
    fig.update_layout(scatterPlot.layout)
    fig.update_layout(
        yaxis=dict(
            tickmode='array',
            tickvals=[-3.090232306, -2.326347874, -1.281551566, -0.841621234, -0.524400513, -0.253347103,
                        0, 0.253347103, 0.524400513, 0.841621234, 1.281551566, 1.644853627, 2.326347874, 3.090232306],
            ticktext=["0.1%", "1%", "10%", "20%", "30%", "40%", "50%",
                        "60%", "70%", "80%", "90%", "95%", "99%", "99.9%"]
        )
    )

    return fig