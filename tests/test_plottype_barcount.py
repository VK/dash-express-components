from numpy import histogram
import dash_express_components as dxc
import plotly.express as px
import pytest

df = px.data.gapminder()


@pytest.mark.parametrize("group", ["color", "facet_row", "facet_col"])
def test_simple(group):

    cfg = {
        "plot": {
            "type": "bar_count",
            "params": {
                "x": "continent",
                group: "year",
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
