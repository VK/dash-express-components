import numpy as _np
from numpy import dtype
from numpy.lib.function_base import insert
import dash_express_components as dec
import dash
from dash.dependencies import Input, Output
from dash import html
from dash import dash_table

import pandas as pd
from datetime import datetime


df = pd.DataFrame({'cat': pd.Categorical(['a', 'a', 'f']),
                   'numbers': [1, 2, 3],
                   'others': [1.3, _np.nan, _np.nan],
                   'bool': [True, False, False],
                   'names': ['a', 'b', 'c'],
                   'cat2': ['f', 'e', 'c'],
                   'time': [datetime.now()]*3
                   })


def eval(df, name, code):

    var_dict = {
        "pi": _np.pi,
        "e": _np.e,
        "hbar": 6.58211951e-16,
        "c": 2.99792458e17,
        "hbar_c": 197.326979,
    }

    df[name] = df.eval(code, local_dict=var_dict, engine='python')


df["extra"] = (df.cat.astype('str') +
               df.names.astype('str')).astype('category')


app = dash.Dash(__name__,
                external_stylesheets=[

                    "https://cdn.jsdelivr.net/npm/bootswatch@5.1.3/dist/united/bootstrap.min.css"
                ])

app.layout = html.Div([

    dec.Configurator(
        id="plotConfig",
        config={
            "filter": [{'col': 'time', 'type': 'lastn', 'value': 12}],
            "transform": [],
            "plot": []
        },
        meta=dec.get_meta(df)
    ),


    html.Div(id='output'),

    dash_table.DataTable(id='table')
], className="p-4", style={"width": "500px"})


@app.callback([Output('output', 'children'),
               Output('table', 'columns'),
               Output('table', 'data')

               ], [Input('plotConfig', 'config')])
def display_output(config):

    new_df = dec.get_plot(df, config)
    return ('Your configuration {}'.format(config),
            [{"name": i, "id": i} for i in new_df.columns],
            new_df.to_dict('records')
            )


if __name__ == '__main__':
    app.run_server(debug=True)
