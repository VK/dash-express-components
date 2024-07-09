import os
os.environ["DASH_EXPRESS_PLOTAPI"] = ""

import dash
from dash import html, Input, Output
import dash_express_components as dxc
import plotly.express as px
from dash.exceptions import PreventUpdate
import json


df = px.data.gapminder()

plot_cfg = {
    "plot": {
        "type": "scatter",
        "params": {
            "x": "pop",
            "y": "lifeExp",
            "color": "country",
            "facet_col": "continent",
            "facet_col_wrap": 2,
            "log_x": True,
            "hover_name": "country",
            "render_mode": "webgl"
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

table_cfg = {
    "plot": {
        "type": "table",
        "params": {
            "dimensions": [
                "country",
                "continent",
                "pop",
                "lifeExp",
                "year"
            ]
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
        html.H3("Plot:"),
        html.Div([
            dxc.Graph(
                id="plot",
                meta=meta,
                defParams=plot_cfg,
                style={"height": "100%", "width": "100%"}
            ),
        ], style={"height": "600px"}),
        html.H5("Selected:"),
        html.Pre([html.Code(id='plot-selected')]),

    ], style={"width": "47%", "float": "left", "marginRight": "3%"}),

    html.Div([
        html.H3("Table:"),
        html.Div([
            dxc.Graph(
                id="table",
                meta=meta,
                defParams=table_cfg,
                style={"height": "100%", "width": "100%"}
            )
        ], style={"height": "600px"}),
        html.H5("Selected:"),
        html.Pre([html.Code(id='table-selected')]),

    ], style={"width": "50%", "float": "left"}),


], className="p-4")


for id in ["plot", "table"]:

    @app.callback(
        Output(id, 'figure'),   Input(id, 'defParams')
    )
    def update_fig(config):
        try:
            fig = dxc.get_plot(df, config, meta=False)
            if fig:
                return fig
            raise PreventUpdate
        except:
            raise PreventUpdate

    @app.callback(
        Output(f'{id}-selected', 'children'),   Input(id, 'selectedData')
    )
    def update_fig(data):
        return json.dumps(data, indent=2)


if __name__ == '__main__':
    app.run_server(debug=True)
