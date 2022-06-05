from numpy import histogram
import dash_express_components as dxc
import plotly.express as px
import pytest

df = px.data.gapminder()



@pytest.mark.parametrize("overlapping", [True, False])
def test_1d_single(overlapping):

    trafo = {
        "type": "bin",
        "cols": "year",
        "name": "evalcol",
        "binning": [
            {
                "min": 0,
                "max": 2000,
                "name": "A"
            },
            {
                "min": 2000,
                "max": 3000,
                "name": "B"
            }
        ],
        "overlapping": overlapping
    }

    if overlapping:
        output_cols = [
            "year",
            "evalcol_A",
            "evalcol_B"
        ]
    else:
        output_cols = [
            "year",
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



@pytest.mark.parametrize("overlapping", [True, False])
def test_1d_list(overlapping):

    trafo = {
        "type": "bin",
        "cols": [
            "year"
        ],
        "name": "evalcol",
        "binning": [
            {
                "min": 0,
                "max": 2000,
                "name": "A"
            },
            {
                "min": 2000,
                "max": 3000,
                "name": "B"
            }
        ],
        "overlapping": overlapping
    }

    if overlapping:
        output_cols = [
            "year",
            "evalcol_A",
            "evalcol_B"
        ]
    else:
        output_cols = [
            "year",
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



@pytest.mark.parametrize("overlapping", [True, False])
def test_1d_multi(overlapping):

    trafo = {
        "type": "bin",
        "cols": [
            "year", "lifeExp"
        ],
        "name": "evalcol",
        "binning": [
            {
                "min": 0,
                "max": 2000,
                "name": "A"
            },
            {
                "min": 2000,
                "max": 3000,
                "name": "B"
            }
        ],
        "overlapping": overlapping
    }

    if overlapping:
        output_cols = [
            "year",
            "year_evalcol_A",
            "year_evalcol_B",
            "lifeExp_evalcol_A",
            "lifeExp_evalcol_B"            
        ]
    else:
        output_cols = [
            "year",
            "year_evalcol",
            "lifeExp_evalcol"
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



@pytest.mark.parametrize("overlapping", [True, False])
def test_2d(overlapping):
    trafo = {
        "type": "bin",
        "cols": [
            "year", "lifeExp"
        ],
        "name": "evalcol",
        "binning": [
            {
                "points": [
                    [
                        0,
                        0
                    ],
                    [
                        10,
                        0
                    ],
                    [
                        10,
                        10
                    ]
                ],
                "name": "C"
            }
        ],
        "overlapping": overlapping
    }

    if overlapping:
        output_cols = [
            "year",
            "evalcol_C"
        ]
    else:
        output_cols = [
            "year",
            "evalcol",
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
