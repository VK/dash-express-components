from numpy import histogram
import dash_express_components as dxc
import plotly.express as px
import pytest

df = px.data.gapminder()


def test_simple():

    cols =  ["country", "year", "lifeExp"]
    cfg = {
        "transform": [{
                "type": "groupby_sample",
                "n": 10,
                
            }],
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




def test_grouped():

    cols =  ["year", "lifeExp"]
    cfg = {
        "transform": [{
                "type": "groupby_sample",
                "n": 10,
                
            }],
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



def test_huge_n():

    cols =  ["year", "lifeExp"]
    cfg = {
        "transform": [{
                "type": "groupby_sample",
                "n": 100000000,
                
            }],
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

