
def _get(inputDataFrame, plotConfigData):
    import numpy as _np
    import pandas as _pd
    from pandas.api.types import is_numeric_dtype as _is_numeric_dtype
    from plotly.subplots import make_subplots as _make_subplots
    import plotly.graph_objects as _go
    from plotly.express.colors import qualitative as _qualitative    


    fig = _go.Figure()

    extra_options = {}

    # if we have cols and rows, we want to make independent
    makeIndepX = False
    makeIndepY = False
    if "indep_x" in plotConfigData["params"]:
        makeIndepX = True
        del plotConfigData["params"]["indep_x"]
    if "indep_y" in plotConfigData["params"]:
        makeIndepY = True
        del plotConfigData["params"]["indep_y"]

    if "colorscale" in plotConfigData["params"]:
        extra_options["colorscale"] = plotConfigData["params"]["colorscale"]

    if "range_color" in plotConfigData["params"]:

        extra_options["zmin"] = plotConfigData["params"]["range_color"][0]
        extra_options["zmax"] = plotConfigData["params"]["range_color"][1]
        del plotConfigData["params"]["range_color"]

    if "x" in plotConfigData["params"] and "y" in plotConfigData["params"] and "dimensions" in plotConfigData["params"]:
        # extrat params
        x = plotConfigData["params"]["x"]
        y = plotConfigData["params"]["y"]
        dimensions = plotConfigData["params"]["dimensions"]

        params = {p: plotConfigData["params"][p] for p in plotConfigData["params"] if p in [
            "facet_col_wrap"]}
        params["binary_string"] = True
        params["contrast_rescaling"] = 'infer'
        params["color_continuous_scale"] = 'RdBu_r'

        # create categorical output
        if all([not _is_numeric_dtype(inputDataFrame[el]) for el in dimensions]):
            
            dcolorscale = []
            values = list(set(_np.concatenate(
                [inputDataFrame[el] for el in dimensions]
            ).tolist()))
            values = [v for v in values if v != "nan"]
            values.sort()
            cvals = [ i/(len(values)) for i in range(len(values)+2)]
            colors = _qualitative.Plotly
            for idx, bin in enumerate(values):
                dcolorscale.extend([[cvals[idx], colors[idx%len(colors)]], [cvals[idx+1], colors[idx%len(colors)]]])

            if "colorscale" in plotConfigData["params"] and len(dcolorscale) == len(plotConfigData["params"]["colorscale"]):
                extra_options["colorscale"] = plotConfigData["params"]["colorscale"]
            else:
                extra_options["colorscale"] = dcolorscale
            extra_options["colorbar_tickvals"] = list(range(len(values)))
            extra_options["colorbar_ticktext"] = values
            extra_options["zmin"] = -0.5
            extra_options["zmax"] = len(values)-0.5


            for el in dimensions:
                extra_map = (inputDataFrame[el].values == "nan" ) | inputDataFrame[el].isna()
                
                inputDataFrame[el] = _pd.Categorical(inputDataFrame[el], categories=values).codes
                inputDataFrame.loc[extra_map, el] = _np.nan

        extraGroupParams = []
        if "facet_col" in plotConfigData["params"]:
            extraGroupParams.append(
                plotConfigData["params"]["facet_col"])

        extraGroupParams = list(
            set(filter(None, extraGroupParams)))

        size = (
            int(inputDataFrame[y].max(
            ) - _np.minimum(0, inputDataFrame[y].min()))+1,
            int(inputDataFrame[x].max(
            ) - _np.minimum(0, inputDataFrame[x].min()))+1
        )
        all_min = (
            int(inputDataFrame[y].min()),
            int(inputDataFrame[x].min())
        )

        def _get_MAP_array(df, color):
            """internal helper to compue an array of the dataframe
            """
            try:
                v_df = df.pivot_table(
                    values=color, index=y, columns=x)

                # shuffle around, to fix all indexing problems :)
                output2 = _np.empty(
                    (size[0], len(v_df.columns.values)))
                output2[:, :] = _np.NaN
                output2[v_df.index.values.astype(
                    int)-all_min[0], :] = v_df.values

                output = _np.empty(size)
                output[:, :] = _np.NaN

                output[:, v_df.columns.values.astype(
                    int)-all_min[1]] = output2
                return output
            except Exception as ex:
                print(ex)
                return None

        if (len(extraGroupParams) > 0 or len(dimensions) > 1):
            data_dict = {}
            if len(extraGroupParams) > 0:
                for group, allValues in inputDataFrame.groupby(extraGroupParams):
                    for color in dimensions:
                        if len(dimensions) == 1:
                            if isinstance(group, str):
                                data_dict[f"{group}"] = _get_MAP_array(
                                    allValues, color)
                            else:
                                data_dict[f"{', '.join(group)}"] = _get_MAP_array(
                                    allValues, color)       
                        else:
                            if isinstance(group, str):
                                data_dict[f"{color} of {group}"] = _get_MAP_array(
                                    allValues, color)
                            else:
                                data_dict[f"{color} of {', '.join(group)}"] = _get_MAP_array(
                                    allValues, color)                                
                           
            else:
                for color in dimensions:
                    if isinstance(color, str):                    
                        data_dict[f"{color}"] = _get_MAP_array(
                            inputDataFrame, color)
                    else:
                        data_dict[f"{', '.join(color)}"] = _get_MAP_array(
                            inputDataFrame, color)                        

            import math
            col_wrap = 100000

            if "facet_col_wrap" in params:
                fig = _make_subplots(
                    math.ceil(len(data_dict) /
                              params["facet_col_wrap"]),
                    params["facet_col_wrap"],
                    shared_xaxes=not makeIndepX,
                    shared_yaxes=not makeIndepY,
                    subplot_titles=tuple(data_dict),
                )
                col_wrap = params["facet_col_wrap"]
            else:
                fig = _make_subplots(1, len(data_dict),
                                     shared_xaxes=not makeIndepX,
                                     shared_yaxes=not makeIndepY,
                                     subplot_titles=tuple(data_dict)
                                     )

            rowid = 1
            colid = 1
            for name, z in data_dict.items():
                fig.add_heatmap(
                    x0=all_min[1], dx=1,
                    y0=all_min[0], dy=1,
                    z=z,
                    name=name,
                    hovertemplate=f"{x}: %{{x}}<br>{y}: %{{y}}<br>{name.split(' of ')[0]}: %{{z}}<br>",
                    row=rowid,
                    col=colid,
                    coloraxis="coloraxis",
                    xaxis=None if makeIndepX else "x",
                    yaxis=None if makeIndepY else "y"
                )
                colid = colid + 1
                if colid > col_wrap:
                    rowid = rowid + 1
                    colid = 1

            if "zmin" in extra_options:
                fig.update_coloraxes(
                    cmin=extra_options["zmin"]
                )
            if "zmax" in extra_options:
                fig.update_coloraxes(
                    cmax=extra_options["zmax"]
                )
            if "colorscale" in extra_options:
                fig.update_coloraxes(
                    colorscale=extra_options["colorscale"]
                )
            if "colorbar_tickvals" in extra_options:
                fig.update_coloraxes(
                    colorbar_tickmode="array",
                    colorbar_tickvals=extra_options["colorbar_tickvals"],
                    colorbar_ticktext=extra_options["colorbar_ticktext"]
                )                

        else:
            fig.add_heatmap(
                x0=all_min[0], dx=1,
                y0=all_min[1], dy=1,
                z=_get_MAP_array(inputDataFrame, dimensions[0]),
                hovertemplate=f"{x}: %{{x}}<br>{y}: %{{y}}<br>{dimensions[0]}: %{{z}}<br>",
                **extra_options
            )

    return fig
