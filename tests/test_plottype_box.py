import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_box_many_aggr():

    cfg = {"plot": {
        "type": "box",
        "params": {
                "x": "continent",
                "y": "pop",
                "color": "continent",
                "aggr": [
                    "mean",
                    "median",
                    "count",
                    "min",
                    "max",
                    "range",
                    "iqr",
                    "q01",
                    "q05",
                    "q25",
                    "q75",
                    "q95",
                    "q99"
                ],
            "title": "OK"
        }
    }}

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


def test_box_single_aggr():

    cfg = {"plot": {
        "type": "box",
        "params": {
            "y": "pop",
            "color": "continent",
            "aggr": "mean",
            "title": "OK"
        }
    }}

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


def test_box_horizontal_aggr():

    cfg = {"plot": {
        "type": "box",
        "params": {
            "x": "pop",
            "aggr": "median",
            "title": "OK"
        }
    }}

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]
