from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_simple():

    trafo = {
        "type": "wide_to_long",
        "stubnames": [
            "iso"
        ],
        "i": [
            "country",
            "continent",
            "year"
        ],
        "j": "Type",
        "sep": "_",
        "suffix": "string"
    }

    output_cols = [
        "country",
        "continent",
        "year",
        "iso",
        "Type"
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

