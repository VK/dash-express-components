import numpy as np
from skimage import data as imgdata
from dash.exceptions import PreventUpdate
import numpy as _np
from numpy import dtype
from numpy.lib.function_base import insert
from plotly.data import tips
import dash_express_components as dxc
import dash
from dash.dependencies import Input, Output, State, MATCH, ALL
from dash import html
from dash import dcc
import dash_bootstrap_components as dbc
import plotly.express as px

import pandas as pd
from datetime import datetime
import json


tips_df = px.data.tips()
#iris_df = px.data.iris()
gapminder_df = px.data.gapminder()


def _img_to_df(data, name):

    if len(data.shape) == 3:
        br_data = np.average(data, axis=2)
    sub_df = pd.DataFrame(br_data).stack().reset_index(level=[0, 1])
    sub_df.columns = ["Y", "X", "Br"]
    sub_df["Name"] = name
    if len(data.shape) == 3:
        sub_df["R"] = data[:, :, 0].flatten()
        sub_df["G"] = data[:, :, 1].flatten()
        sub_df["B"] = data[:, :, 2].flatten()
    return sub_df


image_df = pd.DataFrame()
image_df = image_df.append(_img_to_df(imgdata.cat(), "cat"))
image_df = image_df.append(_img_to_df(imgdata.astronaut(), "astronaut"))
image_df = image_df.append(_img_to_df(imgdata.coffee(), "coffee"))

df = image_df

df = df.rename(columns={"R": "Colour»R", "G": "Colour»G", "B": "Colour»B"})
#df["Test»B"] = _np.nan

# external CSS stylesheets
app = dash.Dash(
    external_stylesheets=[
        dbc.themes.BOOTSTRAP,
        # "https://raw.githubusercontent.com/bvaughn/react-virtualized-select/master/styles.css",
        # "https://gist.githubusercontent.com/aprimadi/a08e2e7e717e6f9bf13821c039befbf9/raw/7c00278a83a30983cc513e1a6a81ba1496ef3a7e/react-select.css"
    ]
)

initial_config = {'filter': [{'col': 'Name', 'type': 'eq', 'value': 'cat'}],
                  'transform': [{'type': 'eval', 'col': 'catfilter', 'formula': '(Br > 20) & (Br < 220)'}],
                  'plot': {'type': 'imshow', 'params': {'x': 'X', 'y': 'Y', 'dimensions': ['Br', 'Colour»R']}},
                  'parameterization': {'parameters': [{'name': 'adsf', 'type': 'o', 'path': ['filter', '0', 'value'], 'value': 'cat', 'col': 'Name'}, {'name': 'data', 'type': 'usa', 'path': ['plot', 'params', 'dimensions'], 'value': ['R', 'G']}],
                                       'computeAll': False, 'computeMatrix': []}}

app.layout = html.Div([

    html.Div([
        dxc.Configurator(
            id="plotConfig",
            config={},
            meta=dxc.get_meta(df),

            showParameterization=True,
            showStore=True
            
        ),

        html.Div(id='output'),
    ], style={"width": "500px", "float": "left"}),

    html.Div(
        [
            dxc.Graph(id={'type': 'fig', 'index': idx},
                      defParams=initial_config, configuratorId="plotConfig")
            for idx in range(3)
        ],
        style={
            "width": "calc(100% - 500px)",
            "display": "inline-block",
            "float": "left"
        }
    )

], className="p-4")


@app.callback([
    Output({'type': 'fig', 'index': ALL}, 'defParams'),
], [Input('plotConfig', 'config')],
    [State({'type': 'fig', 'index': ALL}, 'defParams'),
     State({'type': 'fig', 'index': ALL}, 'id')],
)
def update_plot_config(newConfig, defParams, graphIds):






    if defParams is None:
        raise PreventUpdate

    if "graphId" in newConfig and newConfig["graphId"]:
        graphId = json.loads(newConfig["graphId"])

        print(graphId)
        print(graphIds)

        if graphId in graphIds:
            idx = graphIds.index(graphId)
            del newConfig["graphId"]
            defParams[idx] = newConfig
            print(defParams)
            return defParams,

    return defParams,


@app.callback(
    Output({'type': 'fig', 'index': MATCH}, 'figure'),
    Input({'type': 'fig', 'index': MATCH}, 'defParams'),
)
def update_fig(config):

    fig = None
    try:
        fig = dxc.get_plot(df, config, apply_parameterization=False)
    except:
        pass

    if fig:
        return fig
    else:
        raise PreventUpdate


if __name__ == '__main__':
    app.run_server(debug=True)
