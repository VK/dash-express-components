from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_simple():

    trafo = {
        "type": "dropna",
        "subset": [
            "lifeExp"
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
