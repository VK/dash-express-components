import dash
from dash import html, dcc, Input, Output, State
import dash_express_components as dxc
import json


app = dash.Dash(
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"]
)

app.layout = html.Div([

    html.Div([
        html.H3("Config receiver input"),
        html.Button("Send message", id="button", className="btn btn-primary"),
        html.Pre([html.Code(id='output')]),        

    ], style={"width": "40%", "float": "left", "marginRight": "3%"}),

    html.Div([
        html.H3("Config receiver output"),
        dxc.ConfigReceiver(
            id="receiver",
            token="app1"
        ),

        html.Pre([html.Code(id='receiver-output')]),

    ], style={"width": "49%", "float": "left", "marginRight": "3%"}),


], className="p-4")


@app.callback(
    [
        Output('receiver-output', 'children'),
    ], Input('receiver', 'config')
)
def update_plot_config(newConfig):
    return json.dumps(newConfig, indent=2),


app.clientside_callback(
    """
    function placeholder(n_clicks) {
        
        window.postMessage({config: {n_clicks: n_clicks}, token:"app1" })

        return [n_clicks];
    }
    """,
    [Output("output", "children")],
    [Input("button", "n_clicks")]
)

if __name__ == '__main__':
    app.run_server(debug=True)
