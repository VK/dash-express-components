from numpy import histogram
import dash_express_components as dxc
import plotly.express as px
import pytest

df = px.data.gapminder()

@pytest.mark.parametrize("histnorm", [None, "percent", "density"])
def test_simple(histnorm):

    cfg = {
        "plot": {
            "type": "histogram_line",
            "params": {
                "x": "year",
                "cumulative": True,
                "nbins": 1000,
                "title": "OK",
                "histnorm": histnorm
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


def test_grouped():

    cfg = {
        "plot": {
            "type": "histogram_line",
            "params": {
                "x": "year",
                "cumulative": True,
                "color": "continent",
                "histnorm": "density",
                "nbins": 1000,
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


@pytest.mark.parametrize("histnorm", [None, "percent", "density"])
def test_facet_row(histnorm):

    cfg = {
        "plot": {
            "type": "histogram_line",
            "params": {
                "x": "year",
                "cumulative": True,
                "facet_row": "continent",
                "color": "continent",
                "histnorm":  histnorm,
                "nbins": 1000,
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


def test_facet_col():

    cfg = {
        "plot": {
            "type": "histogram_line",
            "params": {
                "x": "year",
                "cumulative": True,
                "facet_col": "continent",
                "histnorm": "density",
                "nbins": 1000,
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