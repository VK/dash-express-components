import numpy as _np
from numpy import dtype
from numpy.lib.function_base import insert
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
iris_df = px.data.iris()
gapminder_df = px.data.gapminder()

df = gapminder_df

# external CSS stylesheets
app = dash.Dash(
    external_stylesheets=[
        dbc.themes.BOOTSTRAP,
        "https://raw.githubusercontent.com/bvaughn/react-virtualized-select/master/styles.css",
        "https://gist.githubusercontent.com/aprimadi/a08e2e7e717e6f9bf13821c039befbf9/raw/7c00278a83a30983cc513e1a6a81ba1496ef3a7e/react-select.css"
        ]
)

# app = dash.Dash(__name__,
#                 external_stylesheets=[

#                     "https://cdn.jsdelivr.net/npm/bootswatch@5.1.3/dist/united/bootstrap.min.css"
#                 ])

app.layout = html.Div([

    dec.Configurator(
        id="plotConfig",
        config={
            "filter": [{'col': 'time', 'type': 'lastn', 'value': 12}],
            "transform": [{'type': 'eval', 'col': 'test', 'formula': '1'}],
            "plot": []
        },
        meta=dec.get_meta(df)
    ),


    html.Div(id='output'),

    dcc.Graph(id="fig")

], className="p-4", style={"width": "500px"})


@app.callback([Output('output', 'children'),
               Output('fig', 'figure')

               ], [Input('plotConfig', 'config')])
def display_output(config):

    fig = dec.get_plot(df, config)
    return ('Your configuration {}'.format(config),
            fig
            )


if __name__ == '__main__':
    app.run_server(debug=True)
