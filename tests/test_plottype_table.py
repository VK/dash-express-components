from numpy import histogram
import dash_express_components as dxc
import plotly.express as px
import pytest

df = px.data.gapminder()


def test_simple():

    cols =  ["country", "year", "lifeExp"]
    cfg = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": cols
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    for col in cols:
        assert col in fig


def test_sort():

    cols =  ["country", "year", "lifeExp"]
    cfg = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": cols,
                "sort_values": ["year"],
                "sort_values_ascending": False,
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    for col in cols:
        assert col in fig
