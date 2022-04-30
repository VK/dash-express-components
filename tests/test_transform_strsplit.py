from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_simple():

    trafo = {
        "type": "strsplit",
        "col": "splitted",
        "in": "continent",
        "sep": "",
        "start": 0,
        "end": 2,
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
        "splitted"
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
    for el in set(fig["splitted"]):
        assert len(el) == 2


def test_combine_and_split():

    trafos = [
        {
            "type": "combinecat",
            "col": "combined",
            "cols": [
                "continent",
                "country"
            ]
        },
        {
            "type": "strsplit",
            "col": "splitted",
            "in": "combined",
            "sep": "_",
            "start": 0,
        }
    ]

    output_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "pop",
        "gdpPercap",
        "iso_alpha",
        "iso_num",
        "splitted"
    ]

    cfg = {
        "transform": trafos,
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
    for el in set(fig["splitted"]):
        assert el in fig["continent"]
    for el in set(fig["continent"]):
        assert el in fig["splitted"]
