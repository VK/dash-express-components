def _get(inputDataFrame, plotConfigData):
    import plotly.graph_objects as go
    import plotly.express as px
    import plotly.colors as pc
    import numpy as np

    # create a list of polygons
    polygons = []

    # get the colorscale parameter
    colorscale = px.colors.qualitative.Plotly
    if "colorscale" in plotConfigData["params"]:
        colorscale = plotConfigData["params"]["colorscale"]
        # use a plolty colorscale with matching name if available
        try:
            colorscale = px.colors.qualitative.__dict__[colorscale]
        except Exception as e:

            colorscale = px.colors.qualitative.Plotly
    colorscale = [c if isinstance(c, str) else c[1]  for c in colorscale]


    # get the color parameter
    color = None
    continous_color = False
    max_color = None
    min_color = None
    if "color" in plotConfigData["params"]:
        color = plotConfigData["params"]["color"]
        if not isinstance(color, str):
            color = color[1]

        if np.issubdtype(inputDataFrame[color].dtype, np.number):
            colorscale = px.colors.sequential.Viridis
            continous_color = True
            max_color = inputDataFrame[color].max()
            min_color = inputDataFrame[color].min()

    # get the groupby parameter
    groupby = None
    if "groupby" in plotConfigData["params"]:
        groupby = plotConfigData["params"]["groupby"]
        if not isinstance(groupby, list):
            groupby = [groupby]


    # get the hover_data parameter
    hover_data = []
    if "hover_data" in plotConfigData["params"]:
        hover_data = plotConfigData["params"]["hover_data"]
        if not isinstance(hover_data, list):
            hover_data = [hover_data]

    hover_title = None
    if "hover_name" in plotConfigData["params"]:
        hover_title = plotConfigData["params"]["hover_name"]


    title = None
    if "title" in plotConfigData["params"]:
        title = plotConfigData["params"]["title"]


    # get the plot params            
    X = plotConfigData["params"]["x"]
    Y = plotConfigData["params"]["y"]
    IDX = plotConfigData["params"]["idx"]

        


    shape_idx = 0

    def __get_name(data):
        if groupby is not None:
            return ", ".join([str(data[g].iloc[0]) for g in groupby])
        if hover_title is not None:
            return data[hover_title].iloc[0]
        
        return None
    
    legend_names = []

    def __append_shape(data):

        name = __get_name(data)

        if color is not None and color in data.columns:
            if continous_color:
                value = data[color].iloc[0]
                normalized_value = (value - min_color) / (max_color - min_color)
                #use the selected colorscale and map the value to the colorscale
                smooth_color = pc.sample_colorscale(colorscale, normalized_value, colortype="rgb")[0]
                new_color = dict(color=smooth_color)
            else:
                new_color = dict(color=data[color].iloc[0])
        else:
            new_color = dict(color=colorscale[shape_idx % len(colorscale)])

        hover_text = f"<b>{name}</b>"
        if hover_title is not None:
            header_value = data[hover_title].iloc[0]
            hover_text = f"<b>{header_value}</b>"
            
        for h in hover_data:
            hover_text += f"<br>{h}: {data[h].iloc[0]}"

        shape = go.Scatter(
            x=data[X],
            y=data[Y],
            mode="lines",
            fill="toself",
            name=name,
            line=new_color,
            fillcolor=new_color["color"],
            showlegend=name not in legend_names and name is not None,
            legendgroup=name,
            text=hover_text,
            hoverinfo="text",
        )
        legend_names.append(name)
        polygons.append(shape)


    if groupby is None:
        # assume IDX is strong monotonic increasing and make multiple polygons
        min_idx = inputDataFrame[IDX].min()
        local_data = inputDataFrame.copy()
        local_data["__group"] = ((local_data[IDX] - min_idx) == 0).cumsum()

        
        for el, grouped_data in local_data.groupby("__group"):
            __append_shape(grouped_data)
            shape_idx += 1        

        __append_shape(inputDataFrame)

        fig = go.Figure(data=polygons)
        fig.update_layout(legend_tracegroupgap=1)
        return fig
        

    for _, data in inputDataFrame.groupby(groupby):

        # assume IDX is strong monotonic increasing and make multiple polygons
        min_idx = data[IDX].min()
        local_data = data.copy()
        local_data["__group"] = ((local_data[IDX] - min_idx) == 0).cumsum()

        
        for _, grouped_data in local_data.groupby("__group"):
            __append_shape(grouped_data)
        shape_idx += 1        

    fig = go.Figure(data=polygons)
    fig.update_layout(legend_tracegroupgap=1)

    if title is not None:
        fig.update_layout(title=title)
    return fig   