import dash
from dash import html, Input, Output
import dash_express_components as dxc
import plotly.express as px
import json

df = px.data.gapminder()

filter_cfg = [
    {
        "col": "continent",
        "type": "isnotin",
        "value": [
            "Oceania"
        ]
    } 
]

transform_cfg = [
    {
        "type": "melt",
        "col": "Value",
        "col2": "Type",
        "cols": [
            "year",
            "lifeExp",
            "pop",
            "gdpPercap"
        ]
    }
]

plotter_cfg = {
    "type": "box",
    "params": {
            "x": "continent",
            "y": "pop",
            "color": "continent"
    }
}

meta = dxc.get_meta(df)

app = dash.Dash(
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"]
)

app.layout = html.Div([


    html.Div([
        html.H3("Filter:"),
        dxc.Filter(
            id="filter",
            meta=meta,
            config=filter_cfg
        ),
        html.H5("Config:"),
        html.Pre([html.Code(id='filter-output')]),
        html.H5("MetaOut:"),
        html.Pre([html.Code(id='filter-meta-out')]),
    ], style={"width": "30%", "float": "left", "marginRight": "3%"}),



    html.Div([
        html.H3("Transform:"),
        dxc.Transform(
            id="transform",
            meta=meta,
            config=transform_cfg
        ),
        html.H5("Config:"),
        html.Pre([html.Code(id='transform-output')]),
        html.H5("MetaOut:"),
        html.Pre([html.Code(id='transform-meta-out')]),
    ], style={"width": "30%", "float": "left", "marginRight": "3%"}),


    html.Div([
        html.H3("Plotter:"),
        dxc.Plotter(
            id="plotter",
            meta=meta,
            config=plotter_cfg
        ),
        html.H5("Config:"),
        html.Pre([html.Code(id='plotter-output')]),
    ], style={"width": "30%", "float": "left"}),



], className="p-4")


@app.callback(
    [
        Output('filter-output', 'children'),
        Output('filter-meta-out', 'children')
    ], Input('filter', 'config'), Input('filter', 'meta_out')
)
def update_plot_config(newConfig, newMeta):
    return json.dumps(newConfig, indent=2), json.dumps(newMeta, indent=2)


@app.callback(
    [
        Output('transform-output', 'children'),
        Output('transform-meta-out', 'children')
    ], Input('transform', 'config'), Input('transform', 'meta_out')
)
def update_plot_config(newConfig, newMeta):
    return json.dumps(newConfig, indent=2), json.dumps(newMeta, indent=2)


@app.callback(
    Output('plotter-output', 'children'), Input('plotter', 'config')
)
def update_plot_config(newConfig):
    return json.dumps(newConfig, indent=2)


if __name__ == '__main__':
    app.run_server(debug=True)
