from datetime import datetime, timedelta


import base64 as _base64
import json as _json

from . import plottypes
from . import transformationtypes


def get_error_plot(text, meta):
    import plotly.graph_objects as _go

    fig = _go.Figure()
    fig.add_annotation(
        text="<br>".join(text.split("\n")),
        x=0.5,  # X-coordinate of the center
        y=0.5,  # Y-coordinate of the center
        xref="paper",
        yref="paper",
        showarrow=False,
        font=dict(size=18, color="red"),
        align="center",
        bordercolor="black",
        borderwidth=0
    )
    fig.update_layout(
        template="plotly_white"
    )
    fig = fig.to_dict()
    if meta:
        fig.update({"meta": meta})

    return fig


def get_meta(df, large_threshold=1000):
    """
    extract the metadata from a dataframe needed to hand over to the Filter
    """
    from numpy import dtype
    import pandas as _pd

    def parse_object_cat(key):
        cat = df[key].unique()
        if len(cat) > large_threshold:
            return {
                "type": "categorical",
                "large": True,
                "cat": []
            }
        return {
            "type": "categorical",
            "cat": cat.tolist()
        }

    def parse(key, val):
        if isinstance(val, _pd.CategoricalDtype):
            # pandas special cat var

            if len(val.categories) > large_threshold:
                return {
                    "type": "categorical",
                    "large": True,
                    "cat": []
                }
            return {
                "type": "categorical",
                "cat": val.categories.tolist()
            }
        elif val == dtype('O'):
            # conventional string mixed object cat var
            return parse_object_cat(key)

        elif val == dtype('bool'):
            return {
                "type": "bool"
            }
        elif "time" in str(val):
            return {"type": "temporal", **df[key].agg(["median", "min", "max"]).T.to_dict()}
        else:
            try:
                return {"type": "numerical", **df[key].agg(["median", "min", "max"]).T.to_dict()}
            except:
                return parse_object_cat(key)

    return {
        k: parse(k, val)
        for k, val in df.dtypes.to_dict().items()
    }


def get_meta_dask(df, large_threshold=1000):
    from numpy import dtype
    import dask
    """
    extract the metadata from a dask dataframe.
    """

    def parse(key, val):
        
        if val == dtype('O') or val == 'string':

            cat = df[key].unique()
            if len(cat) > large_threshold:
                return {
                    "type": "categorical",
                    "large": True,
                    "cat": []
                }

            return {
                "type": "categorical",
                "cat": cat
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
                "median": df[key].max()
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
        if "cat" in v and not isinstance(v["cat"], list):
            v["cat"] = v["cat"].tolist()
        for ik in ["min", "max", "median"]:
            if v["type"] == "temporal":
                continue
            if ik in v:
                v[ik] = float(v[ik])

    return res


def get_meta_sparkpandas(df, large_threshold=1000):
    """
    extract the metadata from a dataframe needed to hand over to the Filter
    """
    from numpy import dtype

    def parse_object_cat(key):
        cat = df[key].unique()
        if len(cat) > large_threshold:
            return {
                "type": "categorical",
                "large": True,
                "cat": []
            }
        return {
            "type": "categorical",
            "cat": cat.tolist()
        }

    def parse(key, val):
        if isinstance(val, _pd.CategoricalDtype):
            # pandas special cat var

            if len(val.categories) > large_threshold:
                return {
                    "type": "categorical",
                    "large": True,
                    "cat": []
                }
            return {
                "type": "categorical",
                "cat": val.categories.tolist()
            }
        elif val == dtype('O'):
            # conventional string mixed object cat var
            return parse_object_cat(key)

        elif val == dtype('bool'):
            return {
                "type": "bool"
            }
        elif "time" in str(val):
            return {"type": "temporal",
                    "min": df[key].agg("min"),
                    "max": df[key].agg("max"),
                    "median": df[key].agg("median")}
        else:
            try:
                return {"type": "numerical",
                        "min": df[key].agg("min"),
                        "max": df[key].agg("max"),
                        "median": df[key].agg("median")}
            except:
                return parse_object_cat(key)

    return {
        k: parse(k, val)
        for k, val in df.dtypes.to_dict().items()
    }


def get_meta_if_possible(df, compute_types=["custom", "dask", "mongodf", "pyspark"], large_threshold=1000):
    meta = None
    todo = True
    try:

        # try custom
        if todo and "custom" in compute_types:
            try:
                meta = get_meta(df, large_threshold=large_threshold)
                todo = False
            except:
                pass

        # try dask
        if todo and "dask" in compute_types:
            try:
                from dask.dataframe.core import DataFrame as DaskDF
                if isinstance(df, DaskDF):
                    meta = get_meta_dask(df, large_threshold=large_threshold)
                    todo = False
            except:
                pass
        
        # try mongodf
        if todo and "mongodf" in compute_types:
            try:
                from mongodf import DataFrame as MongoDF
                if isinstance(df, MongoDF):
                    meta = df.get_meta()
                    todo = False
            except:
                pass

        # try spark pandas
        if todo and "pyspark" in compute_types:
            try:
                from  pyspark.pandas.frame import DataFrame as SparkDF
                if isinstance(df, SparkDF):
                    meta = get_meta_sparkpandas(df, large_threshold=large_threshold)   
                    todo = False
            except:
                pass

    except:
        pass

    return meta



def apply_filters(inputDataFrame, config):
    """
    apply all filters to a dataframe
    """
    import pandas as _pd

    # apply filters if required
    if isinstance(config, dict) and "filter" in config:
        filter_config = config["filter"]

    if isinstance(filter_config, list):
        filter_config = filter_config

    for el in filter_config:
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
            inputDataFrame = inputDataFrame[inputDataFrame[col] >= _pd.Timestamp(
                el["value"]).to_datetime64()]
        elif t == "before":
            inputDataFrame = inputDataFrame[inputDataFrame[col] <= _pd.Timestamp(
                el["value"]).to_datetime64()]
        elif t == "lastn":
            starttime = datetime.now() - \
                timedelta(days=abs(el["value"]))
            inputDataFrame = inputDataFrame[inputDataFrame[col] > starttime] 


    return inputDataFrame



def apply_transforms(inputDataFrame, config):
    """
    apply all transformations to a dataframe
    """

    if isinstance(config, dict) and "transform" in config:
        transform_config = config["transform"]

    if not isinstance(transform_config, list):
        transform_config = [transform_config]

    for el in transform_config:
        inputDataFrame = getattr(
            transformationtypes, el["type"]).compute(el, inputDataFrame)
        
    return inputDataFrame



def register_transform(trafoclass: transformationtypes.BaseTransform):
    """
    register a transformation class
    """
    name = trafoclass.name
    # check if name is already in the transformationtypes
    if hasattr(transformationtypes, name):
        raise ValueError(
            f"Transformation type {name} already exists. Please use a different name.")
    setattr(transformationtypes, name, trafoclass)

def get_plot(
        inputDataFrame,
        config,
        apply_parameterization=True,
        compute_types=["custom", "dask", "mongodf", "pyspark"],
        meta="compute"
    ):
    errorResult = "Empty plot"
    import pandas as _pd
    import numpy as _np
    import plotly.express as _px
    import plotly.graph_objects as _go

    # check if we have to compute the meta
    if meta == "compute":
        meta = get_meta_if_possible(inputDataFrame)
    if meta == False:
        meta = None


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
                return get_error_plot(errorResult, meta=meta)

            # also json parse the nested params, if needed
            if isinstance(plotConfigData["params"], str):
                plotConfigData["params"] = _json.loads(
                    plotConfigData["params"])

            # don't try too hard, if there is no plot axis
            if not("x" in plotConfigData["params"] or "y" in plotConfigData["params"] or "dimensions" in plotConfigData["params"]):
                return get_error_plot(errorResult, meta=meta)

            # apply filters if required
            if "filter" in configData:
                inputDataFrame = apply_filters(inputDataFrame, configData)
                

            # if dask mongodf or pandas:

            # compute usedCols
            usedCols = [b for a in [
                        (c if type(c) == list else [c]) for c in [
                            plotConfigData["params"].get(key) for key in
                            ["x", "y", "error_x", "error_y", "dimensions",
                                "color", "facet_col",
                                "size", "symbol", "pattern_shape",
                                "facet_row", "hover_name", "lines"]
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
            if not isinstance(inputDataFrame, _pd.DataFrame):

                errorResult = "Error: DataFrame type not known"
                todo = True

                # try custom
                if todo and "custom" in compute_types:
                    try:
                        inputDataFrame = inputDataFrame[[c for c in usedCols if c in inputDataFrame.columns]].compute()
                        todo = False
                    except Exception as err:
                        errorResult = "Error: " + str(err)

                # try dask
                if todo and "dask" in compute_types:
                    try:
                        from dask.dataframe.core import DataFrame as DaskDF
                        if isinstance(inputDataFrame, DaskDF):
                            inputDataFrame = inputDataFrame[[c for c in usedCols if c in inputDataFrame.columns]].compute(
                                scheduler='single-threaded'
                            )
                            todo = False
                    except Exception as err:
                        errorResult = "Error: " + str(err)
                
                # try mongodf
                if todo and "mongodf" in compute_types:
                    try:
                        from mongodf import DataFrame as MongoDF
                        if isinstance(inputDataFrame, MongoDF):
                            inputDataFrame = inputDataFrame[[c for c in usedCols if c in inputDataFrame.columns]].compute()
                            todo = False
                    except Exception as err:
                        errorResult = "Error: " + str(err)

                # try spark pandas
                if todo and "pyspark" in compute_types:
                    try:
                        from  pyspark.pandas.frame import DataFrame as SparkDF
                        if isinstance(inputDataFrame, SparkDF):
                            inputDataFrame = inputDataFrame[[c for c in usedCols if c in inputDataFrame.columns]]._to_pandas()
                            todo = False
                    except Exception as err:
                        errorResult = "Error: " + str(err)
                
                if todo:
                    return get_error_plot(errorResult, meta=meta)
            else:
                inputDataFrame = inputDataFrame[[
                    c for c in usedCols if c in inputDataFrame.columns]].copy()

            # create nan cols if desired
            if "create_missing_cols" in configData and configData["create_missing_cols"]:
                missing_cols = set(usedCols) - set(inputDataFrame.columns)
                if isinstance(configData["create_missing_cols"], list):
                    missing_cols = set(configData["create_missing_cols"]) - set(inputDataFrame.columns)
                for col in missing_cols:
                    inputDataFrame[col] = _np.nan
            
            # check if some data is left
            if "skip_data_check" not in configData and (len(inputDataFrame) == 0 or _np.sum(inputDataFrame.isna().all()) > 0):
                return get_error_plot("No data available.", meta=meta)

            # apply data transformaitons if required
            if "transform" in configData:
                inputDataFrame = apply_transforms(inputDataFrame, configData)

            # extract the render info from the params
            if "render" in plotConfigData["params"]:
                render_type = plotConfigData["params"]["render"]
                del plotConfigData["params"]["render"]
            else:
                render_type = "interactive"

            if "render_size" in plotConfigData["params"]:
                render_size = plotConfigData["params"]["render_size"]
                del plotConfigData["params"]["render_size"]
            else:
                render_size = [1200, 700]

            # if we want to force an axis as categorical
            markCatX = False
            markCatY = False
            if "cat_x" in plotConfigData["params"] and plotConfigData["params"]["cat_x"]:
                markCatX = True
                del plotConfigData["params"]["cat_x"]
            if "cat_y" in plotConfigData["params"] and plotConfigData["params"]["cat_y"]:
                markCatY = True
                del plotConfigData["params"]["cat_y"]

            # if we have cols and rows, we want to make independent
            makeIndepX = False
            makeIndepY = False
            if plotConfigData["type"] not in ["imshow"]:
                if "indep_x" in plotConfigData["params"] and plotConfigData["params"]["indep_x"]:
                    makeIndepX = True
                    del plotConfigData["params"]["indep_x"]
                if "indep_y" in plotConfigData["params"] and plotConfigData["params"]["indep_y"]:
                    makeIndepY = True
                    del plotConfigData["params"]["indep_y"]

            # if we have reversed x and y axis
            reversedX = False
            reversedY = False
            if "reversed_x" in plotConfigData["params"] and plotConfigData["params"]["reversed_x"]:
                reversedX = True
                del plotConfigData["params"]["reversed_x"]
            if "reversed_y" in plotConfigData["params"] and plotConfigData["params"]["reversed_y"]:
                reversedY = True
                del plotConfigData["params"]["reversed_y"]

            # add a sort command for categorical x columns
            if markCatX and "x" in plotConfigData["params"]:
                if not "category_orders" in plotConfigData["params"]:
                    plotConfigData["params"]["category_orders"] = {}
                val_name = plotConfigData["params"]["x"]
                cat_values = inputDataFrame[val_name].unique()
                cat_values.sort()
                plotConfigData["params"]["category_orders"][val_name] = cat_values.tolist(
                )

            # add a sort command for categorical x columns
            if markCatY and "y" in plotConfigData["params"]:
                if not "category_orders" in plotConfigData["params"]:
                    plotConfigData["params"]["category_orders"] = {}
                val_name = plotConfigData["params"]["y"]
                cat_values = inputDataFrame[val_name].unique()
                cat_values.sort()
                plotConfigData["params"]["category_orders"][val_name] = cat_values.tolist(
                )

            # add a sort command if multiple facets are present
            if "facet_row" in plotConfigData["params"]:
                if not "category_orders" in plotConfigData["params"]:
                    plotConfigData["params"]["category_orders"] = {}
                val_name = plotConfigData["params"]["facet_row"]
                cat_values = inputDataFrame[val_name].unique()
                cat_values.sort()
                plotConfigData["params"]["category_orders"][val_name] = cat_values.tolist(
                )

            if "facet_col" in plotConfigData["params"]:
                if not "category_orders" in plotConfigData["params"]:
                    plotConfigData["params"]["category_orders"] = {}
                val_name = plotConfigData["params"]["facet_col"]
                cat_values = inputDataFrame[val_name].unique()
                cat_values.sort()
                plotConfigData["params"]["category_orders"][val_name] = cat_values.tolist(
                )

            # remove nan values from dataframe
            # inputDataFrame = inputDataFrame.dropna(subset=[c for c in inputDataFrame.columns if c in usedCols])

            # return the corresponding plot
            if plotConfigData["type"] == "scatter_matrix":
                fig = _px.scatter_matrix(
                    inputDataFrame, **plotConfigData["params"])
            if plotConfigData["type"] == "density_heatmap":
                fig = _px.density_heatmap(
                    inputDataFrame, **plotConfigData["params"])
            if plotConfigData["type"] == "density_contour":
                fig = _px.density_contour(
                    inputDataFrame, **plotConfigData["params"])
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
            if "x" in plotConfigData["params"] and markCatX:
                fig.update_xaxes(type='category')
            if "y" in plotConfigData["params"] and markCatY:
                fig.update_yaxes(type='category')

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

            # reverse the axis
            if reversedX:
                fig.update_xaxes(autorange="reversed")
            if reversedY:
                fig.update_yaxes(autorange="reversed")

            # automatically render a png if the dataframe is too long
            if len(inputDataFrame) > 200000 and render_type == "auto":
                render_type = "png"

            # transform the fig to an png if object too big
            if render_type == "png":

                try:
                    # prepare to compute the image on a remote orca server
                    fig.update_layout(
                        template="plotly_white"
                    )
                    img_bytes = fig.to_image(
                        format="png", width=render_size[0], height=render_size[1], scale=2)

                    encoded = _base64.b64encode(img_bytes)

                    # create an empty figure with some fixed axis
                    fig = _go.Figure()
                    fig.add_trace(
                        _go.Scatter(
                            x=[0, render_size[0]],
                            y=[0, render_size[1]],
                            mode="markers",
                            marker_opacity=0
                        )
                    )

                    # Configure axes
                    fig.update_xaxes(
                        visible=False,
                        range=[0, render_size[0]]
                    )

                    fig.update_yaxes(
                        visible=False,
                        range=[0, render_size[1]]
                    )

                    fig.update_layout(
                        margin={'l': 0, 'r': 0, 't': 0, 'b': 0},
                        # autosize=True,
                    )

                    # add the png to the figure
                    fig.add_layout_image(

                        source="data:image/png;base64,{}".format(
                            encoded.decode('ascii')),
                        xref="x",
                        yref="y",
                        x=0,
                        sizex=render_size[0],
                        y=render_size[1],
                        sizey=render_size[1],
                        opacity=1.0,
                        layer="below",
                        sizing="stretch"

                    )

                except Exception as ex:
                    print(ex)

            if plotConfigData["type"] != "table":
                fig.update_layout(
                    template="plotly_white"
                )
                output = fig.to_dict()
            else:
                output = fig
            if meta:
                output.update({"meta": meta})

            return output

    except Exception as inst:
        errorResult = "Error: " + str(inst)

    return get_error_plot(errorResult, meta=meta)






def make_response(fig, zipped = "auto", expires = 900, delay = 0.0005, chunk_size = 1024*16):
    """ Create a response for a large plotly figure that can be streamed in chunks

    Parameters
    ----------

    fig: dict or plotly figure
        Plot to be streamed as a JSON response
    
    zipped: bool or str (default: "auto")
        Whether to compress the response with gzip. If "auto", the decision is based on the client's Accept-Encoding header

    expires: int or None (default: 900)
        Number of seconds until the response expires. If None, the response will not expire

    delay: float or None (default: 0.0001)
        Number of seconds to wait between sending chunks. If None, no delay is applied

    chunk_size: int (default: 1024*16)
        Size of each chunk in bytes

    Returns
    -------
    response: flask.Response
        Flask response object that can be returned from a route
    
    """
    import time
    import gzip
    import datetime
    import io
    from plotly.utils import PlotlyJSONEncoder
    import json
    from flask import request, make_response


    if zipped == "auto":
        zipped = "gzip" in request.headers.get('Accept-Encoding', '')

    # Create a generator to stream the JSON response in chunks
    def generate():
        json_data = json.dumps(fig, cls=PlotlyJSONEncoder)
        if zipped:
            gzip_buffer = io.BytesIO()
            with gzip.GzipFile(mode='w', fileobj=gzip_buffer) as gzip_file:
                gzip_file.write(json_data.encode('utf-8'))
            gzip_buffer.seek(0)
            while True:
                chunk = gzip_buffer.read(chunk_size)
                if not chunk:
                    break
                if delay is not None:   
                    time.sleep(delay)
                yield chunk
        else:
            for i in range(0, len(json_data), chunk_size):
                if delay is not None:
                    time.sleep(delay)
                yield json_data[i:i + chunk_size].encode('utf-8')

    response = make_response(generate(), 200)
    if expires is not None:
        response.headers['Expires'] = (datetime.datetime.now() + datetime.timedelta(seconds=expires)).strftime('%a, %d %b %Y %H:%M:%S GMT')

    response.headers['Content-Type'] = "application/json; charset=utf-8"
    if zipped:
        response.headers['Content-Encoding'] = 'gzip'

    return response