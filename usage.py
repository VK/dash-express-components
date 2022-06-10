from skimage import data as imgdata
import pandas as pd
import numpy as np
import datetime
import imp
from re import T
import dash
from dash import html, Input, Output, dcc
from dash.exceptions import PreventUpdate
import dash_express_components as dxc
import plotly.express as px
import plotly
import json
from flask import request

dataframe = {}


dataframe["gapminder"] = px.data.gapminder()
dataframe["gapminder"]["time"] = datetime.datetime.now()


# image testcase


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


dataframe["image"] = pd.DataFrame()
dataframe["image"] = dataframe["image"].append(
    _img_to_df(imgdata.cat(), "cat"))
dataframe["image"] = dataframe["image"].append(
    _img_to_df(imgdata.astronaut(), "astronaut"))
dataframe["image"] = dataframe["image"].append(
    _img_to_df(imgdata.coffee(), "coffee"))

test_cfg = {
    "transform": [
        {
            "type": "aggr",
            "groupby": [
                "country",
                "continent"
            ],
            "cols": ["gdpPercap"],
            "types": [
                "median"
            ]
        }
    ],
    "plot": {
        "type": "box",
        "params": {
            "x": "continent",
            "y": "gdpPercap_median",
            "color": "continent",
            "aggr": ["mean"],
            "reversed_x": True
        }
    },
    "filter": [
        {
            "col": "continent",
            "type": "isnotin",
            "value": [
                "Oceania"
            ]
        }
    ]
}

dataframe_meta = {
    k: dxc.get_meta(df) for k, df in dataframe.items()
}
dataframe_options = list(dataframe.keys())
initial_option = "gapminder"
print(initial_option)


app = dash.Dash(
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"]
)

app.layout = html.Div([

    html.Div([

        dcc.Dropdown(options=[{"label": k, "value": k}
                     for k in dataframe_options], value=initial_option, id='dataframe-type',
                     style={"height": "40px", "marginBottom": "20px"}
                     ),

        dxc.Configurator(
            id="plotConfig",
            meta=dataframe_meta[initial_option],
            config=test_cfg
        ),
        html.H3("Config:"),
        html.Pre([html.Code(id='output')]),
    ], style={"width": "500px", "float": "left"}),

    html.Div(

        [dxc.Graph(id="fig",
                   meta=dataframe_meta[initial_option],
                   plotApi="plotApi",
                   style={"height": "100%", "width": "100%"}
                   )],

        style={"width": "calc(100% - 500px)", "height": "calc(100vh - 30px)",
               "display": "inline-block", "float": "left"}
    )

], className="p-4")


@app.callback(
    [Output('fig', 'defParams'), Output('output', 'children')
     ], Input('plotConfig', 'config')
)
def update_plot_config(newConfig):
    return newConfig, json.dumps(newConfig, indent=2)


@app.callback(
    Output('plotConfig', 'meta'),
    Output('fig', 'meta'),
    Input('dataframe-type', 'value')
)
def update_meta(dataframeType):
    return dataframe_meta[dataframeType], dataframe_meta[dataframeType],


@app.server.route("/plotApi", methods=['POST', 'GET'])
def plotApi():
    config = request.get_json()
    if request.method == 'POST':
        fig = dxc.get_plot(dataframe["gapminder"], config)
        return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return {}

# @app.callback(
#     Output('fig', 'figure'),   Input('fig', 'defParams'), Input('dataframe-type', 'value')
# )
# def update_fig(config, dataframeType):
#     try:
#         fig = dxc.get_plot(dataframe[dataframeType], config)
#         if fig:
#             return fig
#         raise PreventUpdate
#     except:
#         raise PreventUpdate


if __name__ == '__main__':
    app.run_server(debug=False, port=9999)
