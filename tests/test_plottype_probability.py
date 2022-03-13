from numpy import histogram
import dash_express_components as dxc
import plotly.express as px
import pytest

df = px.data.gapminder()


def test_simple():

    cfg = {
        "plot": {
            "type": "probability",
            "params": {
                "x": "lifeExp",
                "title": "OK"
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


@pytest.mark.parametrize("grouptype", ["color", "facet_row", "facet_col"])
def test_grouped(grouptype):

    cfg = {
        "plot": {
            "type": "probability",
            "params": {
                "x": "lifeExp",
                grouptype: "continent",
                "title": "OK"
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]



def test_trendline():

    cfg = {
        "plot": {
            "type": "probability",
            "params": {
                "x": "lifeExp",
                "color": "continent",
                "trendline": "ols",
                "title": "OK"
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]



