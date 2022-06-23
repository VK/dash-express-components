from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_both():

    trafo = {
        "type": "filteriqr",
        "col": "gdpPercap",
        "groupby": [],
        "lower": 1,
        "upper": 1
    }

    output_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "data\u00bbpop",
        "gdpPercap",
        "iso_alpha",
        "iso_num"
    ]

    cfg = {
        "transform": [
            {
                "type": "rename",
                        "columns": {
                            "pop": "data\u00bbpop",
                        }
            },
            trafo
        ],
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


def test_lower():

    trafo = {
        "type": "filteriqr",
        "col": "gdpPercap",
        "groupby": [
            "continent"
        ],
        "lower": 1
    }

    output_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "pop",
        "gdpPercap",
        "iso_alpha",
        "iso_num"
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


def test_upper():

    trafo = {
        "type": "filteriqr",
        "col": "gdpPercap",
        "groupby": [
            "continent"
        ],
        "upper": 1
    }

    output_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "pop",
        "gdpPercap",
        "iso_alpha",
        "iso_num"
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


def test_none():

    trafo = {
        "type": "filteriqr",
        "col": "gdpPercap",
        "groupby": [
            "continent"
        ]
    }

    output_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "pop",
        "gdpPercap",
        "iso_alpha",
        "iso_num"
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
