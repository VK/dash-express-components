from numpy import dtype
import pandas as _pd
import numpy as _np
from datetime import datetime, timedelta
from dateutil import parser

import plotly.express as _px
import plotly.graph_objects as _go
import base64 as _base64
import json as _json

from . import plottypes
from . import transformationtypes


_dummyData = _pd.DataFrame([None])


def get_meta(df):
    """
    extract the metadata from a dataframe needed to hand over to the Filter
    """

    def parse(key, val):
        if isinstance(val, _pd.CategoricalDtype):
            return {
                "type": "categorical",
                "cat": val.categories.tolist()
            }
        elif val == dtype('O'):
            return {
                "type": "categorical",
                "cat": df[key].unique().tolist()
            }
        elif val == dtype('bool'):
            return {
                "type": "bool"
            }
        elif "time" in str(val):
            return {"type": "temporal", **df[key].agg(["median", "min", "max"]).T.to_dict()}
        else:
            return {"type": "numerical", **df[key].agg(["median", "min", "max"]).T.to_dict()}

    return {
        k: parse(k, val)
        for k, val in df.dtypes.to_dict().items()
    }


def get_meta_dask(df):
    from numpy import dtype
    import dask
    """
    extract the metadata from a dask dataframe.
    """

    def parse(key, val):
        if val == dtype('O'):
            return {
                "type": "categorical",
                "cat": df[key].unique()
            }
        elif val == dtype('bool'):
            return {
                "type": "bool"
            }
        elif "time" in str(val):
            return {
                "type": "temporal",
                "min": df[key].min(),
                "max": df[key].max(),
                "median": df[key].mean()
            }
        else:
            return {
                "type": "numerical",
                "min": df[key].min(),
                "max": df[key].max(),
                "median": df[key].mean()
            }

    # create a dictionary of metadata to compute
    res = {
        k: parse(k, val)
        for k, val in df.dtypes.to_dict().items()
    }

    # compute it
    res = dask.compute(res, scheduler='single-threaded')[0]

    # transform the variables to simple python (json dump needed)
    for k, v in res.items():
        if "cat" in v:
            v["cat"] = v["cat"].tolist()
        for ik in ["min", "max", "median"]:
            if ik in v:
                v[ik] = float(v[ik])

    return res


def get_plot(inputDataFrame, config, apply_parameterization=True):

    print(config)

    errorResult = "Empty plot"

    try:
        # check if filter defined
        if config != None:

            # output figure
            fig = None

            configData = config
            # json parse the config if needed
            if isinstance(configData, str):
                configData = _json.loads(configData)

            plotConfigData = configData["plot"]
            # json parse the plotConfigconfig if needed
            if isinstance(plotConfigData, str):
                plotConfigData = _json.loads(plotConfigData)

            # don't try to hard if we have no params
            if not "params" in plotConfigData:
                return _px.scatter(_dummyData, title=errorResult)

            # also json parse the nested params, if needed
            if isinstance(plotConfigData["params"], str):
                plotConfigData["params"] = _json.loads(
                    plotConfigData["params"])

            # don't try too hard, if there is no plot axis
            if not("x" in plotConfigData["params"] or "y" in plotConfigData["params"] or "dimensions" in plotConfigData["params"]):
                return _px.scatter(_dummyData, title=errorResult)

            # apply filters if required
            if "filter" in configData:
                for el in configData["filter"]:
                    col = el["col"]
                    t = el["type"]
                    if t == "isin":
                        inputDataFrame = inputDataFrame[inputDataFrame[col].isin(
                            el["value"])]
                    elif t == "isnotin":
                        inputDataFrame = inputDataFrame[~inputDataFrame[col].isin(
                            el["value"])]
                    elif t == "gt":
                        inputDataFrame = inputDataFrame[inputDataFrame[col]
                                                        > el["value"]]
                    elif t == "gte":
                        inputDataFrame = inputDataFrame[inputDataFrame[col]
                                                        >= el["value"]]
                    elif t == "lt":
                        inputDataFrame = inputDataFrame[inputDataFrame[col]
                                                        < el["value"]]
                    elif t == "lte":
                        inputDataFrame = inputDataFrame[inputDataFrame[col]
                                                        <= el["value"]]
                    elif t == "eq":
                        inputDataFrame = inputDataFrame[inputDataFrame[col]
                                                        == el["value"]]
                    elif t == "neq":
                        inputDataFrame = inputDataFrame[inputDataFrame[col]
                                                        != el["value"]]
                    elif t == "istrue":
                        inputDataFrame = inputDataFrame[inputDataFrame[col]]
                    elif t == "isfalse":
                        inputDataFrame = inputDataFrame[~inputDataFrame[col]]
                    elif t == "after":
                        #df = df[df[col] > _pd.to_datetime(parser.isoparse(el["value"]))]
                        inputDataFrame = inputDataFrame[inputDataFrame[col] > _pd.Timestamp(
                            el["value"]).to_datetime64()]
                    elif t == "before":
                        #df = df[df[col] < _pd.to_datetime(parser.isoparse(el["value"]))]
                        inputDataFrame = inputDataFrame[inputDataFrame[col] < _pd.Timestamp(
                            el["value"]).to_datetime64()]
                    elif t == "lastn":
                        starttime = datetime.now() - \
                            timedelta(days=abs(el["value"]))
                        inputDataFrame = inputDataFrame[inputDataFrame[col] > starttime]

            # if dask mongodf or pandas:

            # compute usedCols
            usedCols = [b for a in [
                        (c if type(c) == list else [c]) for c in [
                            plotConfigData["params"].get(key) for key in
                            ["x", "y", "error_x", "error_y", "dimensions",
                                "color", "facet_col", "facet_row", "hover_name"]
                        ] if c is not None
                        ] for b in a]

            if "hover_data" in plotConfigData["params"]:
                usedCols.extend(plotConfigData["params"]["hover_data"])

            # add cols for transformations
            if "transform" in configData:
                for el in configData["transform"]:
                    usedCols.extend(
                        getattr(transformationtypes, el["type"]).dimensions(
                            el, inputDataFrame)
                    )

            usedCols = list(set(usedCols))

            # if we don't get a pandas dataframe it might be dask or mongodf
            print(usedCols)
            if not isinstance(inputDataFrame, _pd.DataFrame):
                try:
                    inputDataFrame = inputDataFrame[[c for c in usedCols if c in inputDataFrame.columns]].compute(
                        scheduler='single-threaded'
                    )
                except Exception as err:
                    errorResult = "Error: " + str(err)
                    return _px.scatter(_dummyData, title=errorResult)
            else:
                inputDataFrame = inputDataFrame[[
                    c for c in usedCols if c in inputDataFrame.columns]].copy()

            # check if some data is left
            if len(inputDataFrame) == 0:
                return _px.scatter(_dummyData, title="No data available.")

            # apply data transformaitons if required
            if "transform" in configData:
                for el in configData["transform"]:
                    inputDataFrame = getattr(
                        transformationtypes, el["type"]).compute(el, inputDataFrame)

            # if we want to force an axis as categorical
            markCatX = False
            markCatY = False
            if "cat_x" in plotConfigData["params"]:
                markCatX = True
                del plotConfigData["params"]["cat_x"]
            if "cat_y" in plotConfigData["params"]:
                markCatY = True
                del plotConfigData["params"]["cat_y"]

            # if we have cols and rows, we want to make independent
            makeIndepX = False
            makeIndepY = False
            if "indep_x" in plotConfigData["params"]:
                makeIndepX = True
                del plotConfigData["params"]["indep_x"]
            if "indep_y" in plotConfigData["params"]:
                makeIndepY = True
                del plotConfigData["params"]["indep_y"]

            # add a sort command for categorical x columns
            # if "x" in plotConfigData["params"] and plotConfigData["params"]["x"] in self.categorical_Cols and markCatX:
            #     if not "category_orders" in plotConfigData["params"]:
            #         plotConfigData["params"]["category_orders"] = {}
            #     plotConfigData["params"]["category_orders"][plotConfigData["params"]
            #                                                 ["x"]] = self.category_Dict[plotConfigData["params"]["x"]]

            # # add a sort command for categorical y columns
            # if "y" in plotConfigData["params"] and plotConfigData["params"]["y"] in self.categorical_Cols and markCatY:
            #     if not "category_orders" in plotConfigData["params"]:
            #         plotConfigData["params"]["category_orders"] = {}
            #     plotConfigData["params"]["category_orders"][plotConfigData["params"]
            #                                                 ["y"]] = self.category_Dict[plotConfigData["params"]["y"]]

            # remove nan values from dataframe
            #inputDataFrame = inputDataFrame.dropna(subset=[c for c in inputDataFrame.columns if c in usedCols])

            # return the corresponding plot
            if plotConfigData["type"] == "scatter":
                fig = _px.scatter(inputDataFrame, **
                                  plotConfigData["params"])
            if plotConfigData["type"] == "scatter_matrix":
                fig = _px.scatter_matrix(
                    inputDataFrame, **plotConfigData["params"])
            if plotConfigData["type"] == "density_heatmap":
                fig = _px.density_heatmap(
                    inputDataFrame, **plotConfigData["params"])
            if plotConfigData["type"] == "density_contour":
                fig = _px.density_contour(
                    inputDataFrame, **plotConfigData["params"])
            if plotConfigData["type"] == "box":
                fig = _px.box(inputDataFrame, **plotConfigData["params"])
            if plotConfigData["type"] == "violin":
                fig = _px.violin(inputDataFrame, **
                                 plotConfigData["params"])
            if plotConfigData["type"] == "bar":
                if "x" in plotConfigData["params"] and "y" in plotConfigData["params"]:
                    fig = _px.bar(inputDataFrame, **
                                  plotConfigData["params"])
            if plotConfigData["type"] == "histogram":
                if "x" in plotConfigData["params"]:
                    fig = _px.histogram(
                        inputDataFrame, **plotConfigData["params"])

            # call extra plotters
            if hasattr(plottypes,  plotConfigData["type"]):
                fig = getattr(plottypes, plotConfigData["type"])(
                    inputDataFrame, plotConfigData)

            # if we want to force an axis as categorical
            # if "x" in plotConfigData["params"] and plotConfigData["params"]["x"] in self.categorical_Cols and markCatX:
            #     fig.update_xaxes(type='category')
            # if "y" in plotConfigData["params"] and plotConfigData["params"]["y"] in self.categorical_Cols and markCatY:
            #     fig.update_yaxes(type='category')

            if "title" in plotConfigData and plotConfigData["title"] is not None and plotConfigData["title"] != "":
                fig.update_layout(title=plotConfigData["title"])

            # if we want to have independent x and y axis
            if makeIndepX:
                fig.update_xaxes(matches=None, showticklabels=True)
                for idx, a in enumerate([a for a in fig.layout if "xaxis" in a]):
                    d_min, d_max = fig.layout[a].domain
                    d_center = 0.5*(d_min+d_max)
                    d_width = 0.43*(d_max - d_min)
                    fig.layout[a].domain = (
                        d_center - d_width, d_center+d_width)
            if makeIndepY:
                fig.update_yaxes(matches=None, showticklabels=True)

            # transform the fig to an png if object too big
            if "render" in plotConfigData and "png" in plotConfigData["render"]:

                try:
                    # prepare to compute the image on a remote orca server
                    fig.update_layout(
                        template="plotly_white"
                    )
                    img_bytes = fig.to_image(
                        format="png", width=1200, height=700, scale=2)
                    encoded = _base64.b64encode(img_bytes)

                    # create an empty figure with some fixed axis
                    fig = _go.Figure()
                    fig.update_layout(
                        xaxis=_go.layout.XAxis(
                            showticklabels=False,
                            showgrid=False,
                            zeroline=False,
                            range=[0, 1200]
                        ),
                        yaxis=_go.layout.YAxis(
                            showticklabels=False,
                            showgrid=False,
                            zeroline=False,
                            range=[0, 700],
                            scaleanchor='x'
                        ),
                        margin={'l': 0, 'r': 0, 't': 0, 'b': 0},
                        autosize=True,
                    )

                    # add the png to the figure
                    fig.add_layout_image(
                        dict(
                            source="data:image/png;base64,{}".format(
                                encoded.decode('ascii')),
                            xref="x",
                            yref="y",
                            x=0,
                            sizex=1200,
                            y=700,
                            sizey=700,
                            opacity=1.0,
                            layer="below",
                            sizing="stretch"
                        )
                    )

                except Exception as ex:
                    print(ex)

            return fig

    except Exception as inst:
        errorResult = "Error: " + str(inst)

    return _px.scatter(_dummyData, title=errorResult)
