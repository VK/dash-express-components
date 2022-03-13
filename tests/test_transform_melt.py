from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_simple():

    trafo = {
        "type": "melt",
        "col": "Val",
        "col2": "Type",
        "cols": [
            "year",
            "lifeExp",
            "pop",
            "gdpPercap"
        ]
    }

    output_cols = [
        "country",
        "continent",
        "iso_alpha",
        "iso_num",
        "Type",
        "Val"
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
