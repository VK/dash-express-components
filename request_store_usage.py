from skimage import data as imgdata
import pandas as pd
import numpy as np
import datetime
import dash
from dash import html, Input, Output, dcc, State
import dash_express_components as dxc
import plotly.express as px
import plotly
import json
from flask import request


app = dash.Dash(
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"]
)

app.layout = html.Div([
    
    dxc.RequestStore(
        id="store",
        url="/api",
        config={"dummy": 1},
        longCallback=True
    ),

    html.Pre([html.Code(id='output')]),

    

], className="p-4")



@app.server.route("/api", methods=['POST'])
def api():
    # for testing only resonse every 5th request
    if np.random.randint(5) != 0:
        # return a 202 to simulate a long running task
        return {}, 202
    
    if request.method == 'POST':
        df = px.data.gapminder()
       
        return json.dumps(df.to_dict("list"), )
    return {}, 200


@app.callback(
    Output('output', 'children'),
    Input('store', 'data'),
)
def update_config(data):
    return json.dumps(data, indent=2)



if __name__ == '__main__':
    app.run_server(debug=True, port=9999)
