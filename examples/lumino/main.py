import dash
import dash_express_components as dxc
import dash_lumino_components as dlc
from dash import html, Input, Output, State, MATCH
from dash.exceptions import PreventUpdate

import plotly.express as px

# load gapminder example data
df_gapminder = px.data.gapminder()
meta_gapminder = dxc.get_meta(df_gapminder)

# use font-awesome for icons and boostrap for main style
external_stylesheets = [
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
]
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

def get_new_widget(config, id):
    """
    creates a new widget with a plot with the new configuration
    """
    return dlc.Widget(
        dxc.Graph(id={'type': 'graph', 'index': id},
                  defParams=config,
                  meta=meta_gapminder,
                  style={"width": "100%", "height": "100%"}),
        id=f'widget-{id}',
        title="Plot",
        icon="fa fa-globe",
        caption="Gapminder Plot"
    )

# a panel to hold the plot Configurator component
gapminderPanel = dlc.Panel([
    dxc.Configurator(
        id="plotter",
        meta=meta_gapminder,
    )
], id="gapminder-plotter-panel", label="Gapminder", icon="fa fa-globe")


# create the main layout of the app
app.layout = html.Div([
    dlc.BoxPanel([
        dlc.SplitPanel([
            dlc.TabPanel([
                gapminderPanel
            ],
                id='tab-panel-left',
                tabPlacement="left",
                allowDeselect=True,
                currentIndex=2,
                width=450
            ),
            dlc.DockPanel([], id="dock-panel")
        ], id="split-panel")], id="box-panel", addToDom=True)
])


# callback to create new plot widgets
@app.callback(
    Output('dock-panel', 'children'),
    Input('plotter', 'config'),
    [State('dock-panel', 'children')])
def handle_widget(config, widgets):
    if config == None:
        raise PreventUpdate

    # remove all closed widgets
    widgets = [w for w in widgets if not(
        "props" in w and "deleted" in w["props"] and w["props"]["deleted"])]

    next_id = max([0,  *[int(w["props"]["id"].split("-")[-1]) for w in widgets]])+1

    # add a new widget
    return [*widgets, get_new_widget(config, next_id)]


# update the plot data via a matching callback
@app.callback(
    Output({'type': 'graph', 'index': MATCH}, 'figure'),
    Input({'type': 'graph', 'index': MATCH}, 'defParams'))
def update_figure(config):
    return dxc.get_plot(df_gapminder, config)

# start the app
if __name__ == '__main__':
    app.run_server(debug=False)
