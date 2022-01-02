import plotly.figure_factory as ff



def _get(inputDataFrame, plotConfigData):

    data = inputDataFrame[plotConfigData["params"]["dimensions"]]

    return ff.create_table(data)