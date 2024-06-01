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

data = px.data.gapminder().to_dict("list")

app.layout = html.Div([
    
    dxc.DataGraph(
        id="graph",
        data=data,
        defParams={}
    ),

    

    

], className="w-100 h-100")





if __name__ == '__main__':
    app.run_server(debug=True, port=9999)
