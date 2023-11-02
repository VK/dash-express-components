
def _get(inputDataFrame, plotConfigData):

    import plotly.express as _px

    scatter_mode = None
    line_shape = None
    opacity = None

    if "scatter_mode" in plotConfigData["params"]:
        scatter_mode = plotConfigData["params"]["scatter_mode"]
        del plotConfigData["params"]["scatter_mode"]

    if "line_shape" in plotConfigData["params"]:
        line_shape = plotConfigData["params"]["line_shape"]
        del plotConfigData["params"]["line_shape"]

    if "opacity" in plotConfigData["params"]:
        opacity = plotConfigData["params"]["opacity"]
        del plotConfigData["params"]["opacity"]        


    fig = _px.scatter(inputDataFrame, **plotConfigData["params"])

    for d in fig.data:
        if "hovertemplate" in d and "trendline" in d.hovertemplate:
            continue        
        if line_shape:
            d.line.shape = line_shape
        if scatter_mode:
            d.mode = scatter_mode
        if opacity:
            d.opacity = opacity

   
    return fig