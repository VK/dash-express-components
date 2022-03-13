import imp
from re import T
import dash
from dash import html, Input, Output
from dash.exceptions import PreventUpdate
import dash_express_components as dxc
import plotly.express as px
import json

df = px.data.gapminder()

import datetime
df["time"] = datetime.datetime.now()

# image testcase
# import numpy as np
# import pandas as pd
# from skimage import data as imgdata
# def _img_to_df(data, name):

#     if len(data.shape) == 3:
#         br_data = np.average(data, axis=2)
#     sub_df = pd.DataFrame(br_data).stack().reset_index(level=[0, 1])
#     sub_df.columns = ["Y", "X", "Br"]
#     sub_df["Name"] = name
#     if len(data.shape) == 3:
#         sub_df["R"] = data[:, :, 0].flatten()
#         sub_df["G"] = data[:, :, 1].flatten()
#         sub_df["B"] = data[:, :, 2].flatten()
#     return sub_df


# image_df = pd.DataFrame()
# image_df = image_df.append(_img_to_df(imgdata.cat(), "cat"))
# image_df = image_df.append(_img_to_df(imgdata.astronaut(), "astronaut"))
# image_df = image_df.append(_img_to_df(imgdata.coffee(), "coffee"))
# df = image_df

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

meta = dxc.get_meta(df)

app = dash.Dash(
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"]
)

app.layout = html.Div([

    html.Div([

        dxc.Configurator(
            id="plotConfig",
            meta=meta,
            config=test_cfg
        ),
        html.H3("Config:"),
        html.Pre([html.Code(id='output')]),
    ], style={"width": "500px", "float": "left"}),

    html.Div(

        [dxc.Graph(id="fig",
                   meta=meta,
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
    Output('fig', 'figure'),   Input('fig', 'defParams')
)
def update_fig(config):
    try:
        fig = dxc.get_plot(df, config)
        if fig:
            return fig
        raise PreventUpdate
    except:
        raise PreventUpdate


if __name__ == '__main__':
    app.run_server(debug=True, port=9999)
