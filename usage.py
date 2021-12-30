import numpy as _np
from numpy import dtype
from numpy.lib.function_base import insert
from plotly.data import tips
import dash_express_components as dec
import dash
from dash.dependencies import Input, Output
from dash import html
from dash import dcc
import dash_bootstrap_components as dbc
import plotly.express as px

import pandas as pd
from datetime import datetime


tips_df = px.data.tips()
#iris_df = px.data.iris()
#gapminder_df = px.data.gapminder()

df = tips_df

# external CSS stylesheets
app = dash.Dash(
    external_stylesheets=[
        dbc.themes.BOOTSTRAP,
        "https://raw.githubusercontent.com/bvaughn/react-virtualized-select/master/styles.css",
        "https://gist.githubusercontent.com/aprimadi/a08e2e7e717e6f9bf13821c039befbf9/raw/7c00278a83a30983cc513e1a6a81ba1496ef3a7e/react-select.css"
    ]
)

app.layout = html.Div([

    html.Div([
        dec.Configurator(
            id="plotConfig",
            config={
                "filter": [],
                "transform": [],
                "plot": []
            },
            meta=dec.get_meta(df)
        ),

        html.Div(id='output'),
    ], style={"width": "500px", "float": "left"}),

    html.Div(
        [dcc.Graph(id="fig")], style={"width": "calc(100% - 500px)", "height": "100%", "float": "left"}
    )

], className="p-4")


@app.callback([Output('output', 'children'),
               Output('fig', 'figure')

               ], [Input('plotConfig', 'config')])
def display_output(config):

    fig = dec.get_plot(df, config, apply_parameterization=False)
    return ('Your configuration {}'.format(config),
            fig
            )


if __name__ == '__main__':
    app.run_server(debug=True)
