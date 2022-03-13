from numpy import histogram
import dash_express_components as dxc
import plotly.express as px

df = px.data.gapminder()


def test_simple():

    trafo = {
        "type": "aggr",
        "groupby": [
            "country",
            "continent"
        ],
        "cols": [
            "gdpPercap"
        ],
        "types": [
            "median",
            "min",
            "max",
            "mean",
            "count",
            "sum",
            "std",
            "var",
            "range",
            "iqr",
            "q01",
            "q05",
            "q25",
            "q75",
            "q95",
            "q99"
        ]
    }

    output_cols = [
       "country",
        "continent",
        "gdpPercap_median",
        "gdpPercap_min",
        "gdpPercap_max",
        "gdpPercap_mean",
        "gdpPercap_count",
        "gdpPercap_sum",
        "gdpPercap_std",
        "gdpPercap_var",
        "gdpPercap_range",
        "gdpPercap_iqr",
        "gdpPercap_q01",
        "gdpPercap_q25",
        "gdpPercap_q05",
        "gdpPercap_q75",
        "gdpPercap_q95",
        "gdpPercap_q99"
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
