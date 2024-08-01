from skimage import data as imgdata
import pandas as pd
import numpy as np
import datetime
import dash
from dash import html, Input, Output, dcc, State
import dash_express_components as dxc
import plotly.express as px
import plotly
import json
from flask import request


app = dash.Dash(
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    ]
)

data = px.data.gapminder()

app.layout = html.Div(
    [
        dxc.DataGraph(
            id="graph",
            data={}
        ),
        html.Pre([html.Code(id="output")]),
    ],
    className="w-100 h-100",
    id="mainContainer",
)


@app.callback(
    Output("graph", "data"), Input("mainContainer", "style"), prevent_initial_call=False
)
def update_data(style):
    return data.to_dict("list")


@app.callback(
    Output("output", "children"),
    Input("graph", "defParams"),
)
def update_plot_config(newConfig):
    return json.dumps(newConfig, indent=2)


if __name__ == "__main__":
    app.run_server(debug=True, port=9999)
