from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_simple():

    trafo = {
        "type": "eval",
        "col": "evalcol",
        "formula": "year**2"
    }

    output_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "pop",
        "gdpPercap",
        "iso_alpha",
        "iso_num",
        "evalcol"
    ]

    cfg = {
        "transform": [trafo],
        "plot": {
            "type": "table",
            "params": {
                "dimensions": output_cols
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    for col in output_cols:
        assert col in fig


def test_nested_columns():

    trafo = [
        {
            "type": "rename",
            "columns": {
                "lifeExp": "data\u00bblifeExp",
                "pop": "data\u00bbpop",
                "gdpPercap": "data\u00bbgdpPercap"
            }
        },
        {
            "type": "eval",
            "col": "testeval",
            "formula": "data\u00bblifeExp**2"
        }
    ]

    output_cols = [
        "continent",
        "country",
        "iso_alpha",
        "iso_num",
        "testeval",
        "year",
        "data\u00bblifeExp",
        "data\u00bbpop",
        "data\u00bbgdpPercap"
    ]

    cfg = {
        "transform": trafo,
        "plot": {
            "type": "table",
            "params": {
                "dimensions": output_cols
            }
        }
    }

    fig = dxc.get_plot(df, cfg)

    for col in output_cols:
        assert col in fig
