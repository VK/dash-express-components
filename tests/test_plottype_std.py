import dash_express_components as dxc
import plotly.express as px
import json
df = px.data.gapminder()


def test_str_config():

    cfg = """{"plot": {"type": "box", "params": {"x": "continent", "y": "pop", "color": "continent", "aggr": ["mean", "median", "count", "min", "max", "range", "iqr", "q01", "q05", "q25", "q75", "q95", "q99"], "title": "OK"}}}"""

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


def test_str_plot():

    cfg = {
        "plot": """{"type": "box", "params": {"x": "continent", "y": "pop", "color": "continent", "aggr": ["mean", "median", "count", "min", "max", "range", "iqr", "q01", "q05", "q25", "q75", "q95", "q99"], "title": "OK"}}"""}

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


def test_str_params():

    cfg = {"plot": {"type": "box",
                    "params": """{"x": "continent", "y": "pop", "color": "continent", "aggr": ["mean", "median", "count", "min", "max", "range", "iqr", "q01", "q05", "q25", "q75", "q95", "q99"], "title": "OK"}"""
                    }}

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


def test_str_no_params():

    cfg = {"plot": {"type": "box"}}

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "Empty plot" == fig["layout"]["title"]["text"]


def test_str_empty_params():

    cfg = {"plot": {"type": "box", "params": {}}}

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "Empty plot" == fig["layout"]["title"]["text"]


def test_std_dimensions():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "lifeExp",
                "y": "pop",
                "color": "gdpPercap",
                "symbol": "continent",
                "size": "year",
                "render_mode": "webgl",
                "title": "OK"
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    assert "layout" in fig
    assert "title" in fig["layout"]
    assert "text" in fig["layout"]["title"]
    assert "OK" == fig["layout"]["title"]["text"]


def test_std_hover_data():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "lifeExp",
                "y": "pop",
                "hover_data": ["country"]
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    hovertemplate = fig["data"][0]["hovertemplate"]
    assert "country" in hovertemplate


def test_std_hover_name():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "lifeExp",
                "y": "pop",
                "hover_name": "country"
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    hovertemplate = fig["data"][0]["hovertemplate"]
    assert "hovertext" in hovertemplate


def test_std_cat_x():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "country",
                "y": "continent",
                "cat_x": True
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    assert "layout" in fig
    assert "xaxis" in fig["layout"]
    assert "categoryarray" in fig["layout"]["xaxis"]


def test_std_cat_y():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "country",
                "y": "continent",
                "cat_y": True
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    assert "layout" in fig
    assert "yaxis" in fig["layout"]
    assert "categoryarray" in fig["layout"]["yaxis"]


def test_std_indep_x():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "lifeExp",
                "y": "pop",
                "facet_row": "continent",
                "indep_x": True
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    assert "layout" in fig
    for idx in range(2, 6):
        assert f"xaxis{idx}" in fig["layout"]
        assert f"yaxis{idx}" in fig["layout"]
        assert "matches" not in fig["layout"][f"xaxis{idx}"]


def test_std_indep_y():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "lifeExp",
                "y": "pop",
                "facet_col": "continent",
                "indep_y": True
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    assert "layout" in fig
    for idx in range(2, 6):
        assert f"xaxis{idx}" in fig["layout"]
        assert f"yaxis{idx}" in fig["layout"]
        assert "matches" not in fig["layout"][f"yaxis{idx}"]


def test_std_reversed_x():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "lifeExp",
                "y": "pop",
                "reversed_x": True
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    assert "layout" in fig
    assert "xaxis" in fig["layout"]
    assert "autorange" in fig["layout"]["xaxis"]
    assert "reversed" == fig["layout"]["xaxis"]["autorange"]


def test_std_reversed_y():

    cfg = {
        "plot": {
            "type": "scatter",
            "params": {
                "x": "lifeExp",
                "y": "pop",
                "reversed_y": True
            }
        }
    }

    fig = json.loads(dxc.get_plot(df, cfg).to_json())

    assert "data" in fig
    assert "layout" in fig
    assert "yaxis" in fig["layout"]
    assert "autorange" in fig["layout"]["yaxis"]
    assert "reversed" == fig["layout"]["yaxis"]["autorange"]


def test_scatter_matrix():

    cfg = {
        "plot": {
            "type": "scatter_matrix",
            "params": {
                "dimensions": ["lifeExp", "pop"],
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


def test_density_heatmap():

    cfg = {
        "plot": {
            "type": "density_heatmap",
            "params": {
                "x": "lifeExp",
                "y": "pop",
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


def test_density_contour():

    cfg = {
        "plot": {
            "type": "density_contour",
            "params": {
                "x": "lifeExp",
                "y": "pop",
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


def test_violin():

    cfg = {
        "plot": {
            "type": "violin",
            "params": {
                "y": "pop",
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


def test_bar():

    cfg = {
        "plot": {
            "type": "bar",
            "params": {
                "x": "year",
                "y": "continent",
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


def test_histogram():

    cfg = {
        "plot": {
            "type": "histogram",
            "params": {
                "x": "year",
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


def test_render_png():

    cfg = {
        "plot": {
            "type": "histogram",
            "params": {
                "x": "year",
                "title": "OK",
                "render": "png"
            },

        }
    }

    fig = dxc.get_plot(df, cfg)

    assert "data" in fig
    assert "layout" in fig
    assert "images" in fig["layout"]
    assert 1 == len(fig["layout"]["images"])
    assert fig["layout"]["images"][0]["source"].startswith(
        "data:image/png;base64")
