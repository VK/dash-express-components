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

dataframe = {}


dataframe["gapminder"] = px.data.gapminder()
dataframe["gapminder"]["time"] = datetime.datetime.now()

dataframe["world"] = pd.read_csv("./world.csv")
dataframe["world"]["color"] = "#ff0000"
country_names = dataframe["world"]["Country"].unique().tolist()
dataframe["world"]["Country_IDX"] = dataframe["world"].apply(
    lambda x: country_names.index(x["Country"]), axis=1)


# image testcase


def _img_to_df(data, name):

    if len(data.shape) == 3:
        br_data = np.average(data, axis=2)
    sub_df = pd.DataFrame(br_data).stack().reset_index(level=[0, 1])
    sub_df.columns = ["Y", "X", "Br"]
    sub_df["Name"] = name
    if len(data.shape) == 3:
        sub_df["R"] = data[:, :, 0].flatten()
        sub_df["G"] = data[:, :, 1].flatten()
        sub_df["B"] = data[:, :, 2].flatten()
    return sub_df


dataframe["image"] = pd.concat([
    _img_to_df(imgdata.cat(), "cat"),
    _img_to_df(imgdata.astronaut(), "astronaut"),
    _img_to_df(imgdata.coffee(), "coffee")
])


test_cfg = {
  "plot": {
    "type": "imshow",
    "params": {
      "x": "X",
      "y": "Y",
      "dimensions": [
        "test"
      ],
      "facet_col": "Name",
      "facet_col_wrap": 2,
      "render": "interactive"
    }
  },
  "transform": [
    {
      "type": "add_noise"
    },
    {
      "type": "bin",
      "cols": [
        "Br"
      ],
      "name": "test",
      "binning": [
        {
          "min": 0,
          "max": 50,
          "name": "A"
        },
        {
          "min": 50,
          "max": 250,
          "name": "B"
        }
      ],
      "overlapping": False
    },
    {
      "type": "eval",
      "col": "X",
      "formula": "X-100"
    }
  ],
  "filter": [],

}

test_cfg = {
  "plot": {
    "type": "table",
    "params": {
      "dimensions": [
        "Name",
        "Br_A",
        "Br_B"
      ]
    }
  },
  "transform": [
    {
      "type": "add_noise"
    },
    {
      "type": "bin",
      "cols": [
        "Br"
      ],
      "name": "test",
      "binning": [
        {
          "min": 0,
          "max": 50,
          "name": "A"
        },
        {
          "min": 50,
          "max": 250,
          "name": "B"
        }
      ],
      "overlapping": False
    },
    {
      "type": "eval",
      "col": "X",
      "formula": "X-100"
    },
    {
      "type": "pivot_table",
      "index": [
        "Name"
      ],
      "columns": [
        "test"
      ],
      "values": [
        "Br"
      ],
      "aggfunc": []
    }
  ],
  "filter": [],
  "parameterization": {
    "parameters": [],
    "computeAll": False,
    "computeMatrix": []
  }
}


# test_cfg = {
#   "plot": {
#     "type": "histogram_line",
#     "params": {
#       "x": "year",
#       "color": "continent",
#       "nbins": 50
#     }
#   },
#   "filter": [],
#   "transform": [],
#   "parameterization": {
#     "parameters": [],
#     "computeAll": False,
#     "computeMatrix": []
#   }
# }

dataframe_meta = {
    k: dxc.get_meta(df) for k, df in dataframe.items()
}
dataframe_options = list(dataframe.keys())
initial_option = "image"
#initial_option = "gapminder"


app = dash.Dash(
    external_stylesheets=["https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"]
)

app.layout = html.Div([

    html.Div([

        dcc.Dropdown(options=[{"label": k, "value": k}
                     for k in dataframe_options], value=initial_option, id='dataframe-type',
                     style={"height": "40px", "marginBottom": "20px"}
                     ),

        dxc.Configurator(
            id="plotConfig",
            meta=dataframe_meta[initial_option],
            config=test_cfg
        ),
        html.H3("Config:"),
        html.Pre([html.Code(id='output')]),
    ], style={"width": "500px", "float": "left"}),

    html.Div(

        [dxc.Graph(id="fig",
                   #meta=dataframe_meta[initial_option],
                   plotApi="plotApi",
                   style={"height": "100%", "width": "100%"},
                   editButton=True,
                   longCallback=True
                   )],

        style={"width": "calc(100% - 500px)", "height": "calc(100vh - 30px)",
               "display": "inline-block", "float": "left"}
    )

], className="p-4")


@app.callback(
    Output('fig', 'defParams'),
    Input('plotConfig', 'config'),
    Input('dataframe-type', 'value')
)
def update_plot_config(newConfig, dataframe_type):
    newConfig.update({"dataframe_type": dataframe_type})

    return newConfig


@app.callback(
    Output('output', 'children'),
    Input('plotConfig', 'config'),
    State('plotConfig', 'currentConfig')
)
def update_config(_, newConfig):
    return json.dumps(newConfig, indent=2)


# @app.callback(
#     Output('plotConfig', 'meta'),
#     Output('fig', 'meta'),
#     Input('dataframe-type', 'value')
# )
# def update_meta(dataframeType):
#     return dataframe_meta[dataframeType], dataframe_meta[dataframeType],


@app.callback(
    Output('plotConfig', 'meta'),
    Input('dataframe-type', 'value')
)
def update_meta(dataframeType):
    return dataframe_meta[dataframeType]

@app.server.route("/plotApi", methods=['POST', 'GET'])
def plotApi():
    # for testing only resonse every 5th request
    #if np.random.randint(5) != 0:
        # return a 202 to simulate a long running task
    #    return {}, 202
    
    config = request.get_json()
    if request.method == 'POST':

        if "transform" not in config:
            config["transform"] = []

        #config["transform"].append({"type": "groupby_sample", "n":5})

        dataframe_type = "gapminder"
        if "dataframe_type" in config:
            dataframe_type = config["dataframe_type"]
        fig = dxc.get_plot(dataframe[dataframe_type], config)
        return dxc.make_response(fig)
    return {}, 200

# @app.callback(
#     Output('fig', 'figure'),   Input('fig', 'defParams'), Input('dataframe-type', 'value')
# )
# def update_fig(config, dataframeType):
#     try:
#         fig = dxc.get_plot(dataframe[dataframeType], config)
#         if fig:
#             return fig
#         raise PreventUpdate
#     except:
#         raise PreventUpdate





class NoiseTransform(dxc.BaseTransform):
    def compute(self, cfg, inputDataFrame):

        import numpy as np

        if "BR" in inputDataFrame.columns:
          data_legth = inputDataFrame["Br"].values.shape[0]
          inputDataFrame["Br"] = inputDataFrame["Br"] + np.random.normal(0, 20, data_legth)

        return inputDataFrame

dxc.register_transform(NoiseTransform("add_noise"))




if __name__ == '__main__':
    app.run_server(debug=True, port=9999)
