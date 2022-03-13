from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_simple():

    trafo = {
        "type": "catlookup",
        "col": "lookupval",
        "incol": "continent",
        "values": {
            "Asia": 1,
            "Europe": 2,
            "Africa": 3,
            "Americas": 4,
            "Oceania": 5
        }
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
        "lookupval"
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
