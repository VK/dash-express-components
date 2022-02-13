import dash
from dash import html, Input, Output
from dash.exceptions import PreventUpdate
import dash_express_components as dxc
import plotly.express as px


df = px.data.gapminder()
df = df.rename(columns={
    "country": "location»country",
    "continent": "location»continent",
    "iso_alpha": "location»iso_alpha",
    "iso_num": "location»iso_num"
})
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
        ),

        html.Div(id='output'),
    ], style={"width": "500px", "float": "left"}),

    html.Div(

        [dxc.Graph(id="fig",
                   configuratorId="plotConfig",
                   meta=meta,
                   style={"height": "100%", "width": "100%"}
                   )],

        style={"width": "calc(100% - 500px)", "height": "calc(100vh - 30px)",
               "display": "inline-block", "float": "left"}
    )

], className="p-4")


@app.callback(
    Output('fig', 'defParams'), Input('plotConfig', 'config')
)
def update_plot_config(newConfig):
    return newConfig


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
    app.run_server(debug=True)
