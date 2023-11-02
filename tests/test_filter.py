import dash_express_components as dxc
import plotly.express as px
import datetime
import pytest

from .__utils import assert_error_in_annotation

df = px.data.gapminder()


def test_combined():

    config = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": [
                    "country",
                    "continent",
                    "year",
                    "lifeExp",
                    "pop",
                    "gdpPercap",
                    "iso_alpha",
                    "iso_num"
                ]
            }
        },
        "filter": [
            {
                "col": "continent",
                "type": "isnotin",
                "value": [
                    "Oceania"
                ]
            },
            {
                "col": "continent",
                "type": "isin",
                "value": [
                    "Asia",
                    "Europe",
                    "Africa"
                ]
            },
            {
                "col": "year",
                "type": "gt",
                "value": 2000
            },
            {
                "col": "pop",
                "type": "gte",
                "value": 0
            },
            {
                "col": "gdpPercap",
                "type": "neq",
                "value": 12145654
            },
            {
                "col": "year",
                "type": "eq",
                "value": 2002
            },
            {
                "col": "pop",
                "type": "lt",
                "value": 1213245654123
            },
            {
                "col": "pop",
                "type": "lte",
                "value": 12132456541
            }
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

    fig = dxc.get_plot(df, config)

    for col in output_cols:
        assert col in fig


def test_time_after():

    test_df = df.copy()
    test_df["time"] = datetime.datetime.now()

    config = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": [
                    "country",
                    "continent",
                    "year",
                    "lifeExp",
                    "pop",
                    "gdpPercap",
                    "iso_alpha",
                    "iso_num",
                    "time"
                ]
            }
        },
        "filter": [
            {
                "col": "time",
                "type": "after",
                "value": "2022-01-01T20:43:55.118Z"
            }
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
        "iso_num",
        "time"
    ]

    fig = dxc.get_plot(test_df, config)

    for col in output_cols:
        assert col in fig



def test_time_before():

    test_df = df.copy()
    test_df["time"] = datetime.datetime.now()

    config = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": [
                    "country",
                    "continent",
                    "year",
                    "lifeExp",
                    "pop",
                    "gdpPercap",
                    "iso_alpha",
                    "iso_num",
                    "time"
                ]
            }
        },
        "filter": [
            {
                "col": "time",
                "type": "before",
                "value": "2022-01-01T20:43:55.118Z"
            }
        ]
    }

    fig = dxc.get_plot(test_df, config)

    assert "data" in fig
    # assert "layout" in fig
    # assert "title" in fig["layout"]
    # assert "text" in fig["layout"]["title"]
    # assert "No data available." == fig["layout"]["title"]["text"]
    assert_error_in_annotation(fig, "No data available.")

    




def test_time_lastn():

    test_df = df.copy()
    test_df["time"] = datetime.datetime.now()

    config = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": [
                    "country",
                    "continent",
                    "year",
                    "lifeExp",
                    "pop",
                    "gdpPercap",
                    "iso_alpha",
                    "iso_num",
                    "time"
                ]
            }
        },
        "filter": [
            {
                "col": "time",
                "type": "lastn",
                "value": 10
            }
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
        "iso_num",
        "time"
    ]

    fig = dxc.get_plot(test_df, config)

    for col in output_cols:
        assert col in fig





def test_time_istrue():

    test_df = df.copy()
    test_df["bool"] = True

    config = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": [
                    "country",
                    "continent",
                    "year",
                    "lifeExp",
                    "pop",
                    "gdpPercap",
                    "iso_alpha",
                    "iso_num",
                    "bool"
                ]
            }
        },
        "filter": [
            {
                "col": "bool",
                "type": "istrue",
            }
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
        "iso_num",
        "bool"
    ]

    fig = dxc.get_plot(test_df, config)

    for col in output_cols:
        assert col in fig



def test_time_isfalse():

    test_df = df.copy()
    test_df["bool"] = True

    config = {
        "plot": {
            "type": "table",
            "params": {
                "dimensions": [
                    "country",
                    "continent",
                    "year",
                    "lifeExp",
                    "pop",
                    "gdpPercap",
                    "iso_alpha",
                    "iso_num",
                    "bool"
                ]
            }
        },
        "filter": [
            {
                "col": "bool",
                "type": "isfalse"
            }
        ]
    }

    fig = dxc.get_plot(test_df, config)

    assert "data" in fig
    # assert "layout" in fig
    # assert "title" in fig["layout"]
    # assert "text" in fig["layout"]["title"]
    # assert "No data available." == fig["layout"]["title"]["text"]
    assert_error_in_annotation(fig, "No data available.")



