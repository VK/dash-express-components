import dash
from dash import html, Input, Output
import dash_express_components as dxc
import plotly.express as px
import json

import pandas as pd

df = pd.read_csv(
    'https://raw.githubusercontent.com/plotly/datasets/master/solar.csv')

app = dash.Dash(__name__)

data = df.to_dict("list")
print(data)

app.layout = html.Div([
    # dxc.DataTable(
    #     id='table',
    #     columns=[{"name": i, "id": i} for i in df.columns],
    #     data=data,
    #     filter_action="native",
    #     sort_action="native",
    #     sort_mode="multi",
    #     row_selectable="multi"
    # ), 

    dxc.Graph(
        id='table',
        figure=data,
    ),     
    
    
    dxc.Graph(
        id="graph",
        figure=px.scatter(data, x="Number of Solar Plants",
                          y="Generation (GWh)", hover_name="State",
                          hover_data=["Generation (GWh)"])
    ),
    html.Pre(id='selected-data'),
])


@app.callback(
    Output('selected-data', 'children'),
    Input('table', 'selectedData'),
    Input('graph', 'selectedData')
)
def display_selected_data(table, graph):
    return json.dumps({
        "table": table,
        "graph": graph
    }, indent=2)


if __name__ == '__main__':
    app.run_server(debug=True)
