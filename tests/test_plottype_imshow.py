import dash_express_components as dxc
import numpy as np
import pandas as pd
from skimage import data as imgdata


def _img_to_df(data, name):

    if len(data.shape) == 3:
        br_data = np.average(data, axis=2)
    sub_df = pd.DataFrame(br_data).stack().reset_index(level=[0, 1])
    sub_df.columns = ["Y", "X", "Br"]
    sub_df["Name"] = name
    if len(data.shape) == 3:
        sub_df["R"] = data[:, :, 0].flatten()
        sub_df["G"] = data[:, :, 1].flatten()
        sub_df["B"] = data[:, :, 2].flatten()
    return sub_df


image_df = pd.DataFrame()
image_df = image_df.append(_img_to_df(imgdata.cat(), "cat"))
image_df = image_df.append(_img_to_df(imgdata.astronaut(), "astronaut"))
image_df = image_df.append(_img_to_df(imgdata.coffee(), "coffee"))


def test_simple():
    cfg = {
        "plot": {
            "type": "imshow",
            "params": {
                "render": "interactive",
                "x": "X",
                "y": "Y",
                "dimensions": [
                    "Br"
                ],
                "reversed_y": True
            }
        },
        "filter": [
            {
                "col": "Name",
                "type": "eq",
                "value": "cat"
            }
        ]
    }

    fig = dxc.get_plot(image_df, cfg)

    assert "data" in fig
    assert 1 == len(fig["data"])


def test_multi_dim():
    cfg = {
        "plot": {
            "type": "imshow",
            "params": {
                "render": "interactive",
                "x": "X",
                "y": "Y",
                "dimensions": [
                    "R",
                    "G",
                    "B"
                ],
                "reversed_y": True,
                "range_color": [10, 60]
            }
        },
        "filter": [
            {
                "col": "Name",
                "type": "eq",
                "value": "cat"
            }
        ]
    }

    fig = dxc.get_plot(image_df, cfg)

    assert "data" in fig

    subplot_names = [el["name"] for el in fig["data"]]
    expected = ['R', 'G', 'B']
    assert len(subplot_names) == len(expected)
    assert all([a == b for a, b in zip(subplot_names, expected)])


def test_multi_group():

    cfg = {
        "plot": {
            "type": "imshow",
            "params": {
                "render": "interactive",
                "x": "X",
                "y": "Y",
                "dimensions": [
                    "Br"
                ],
                "facet_col": "Name",
                "facet_col_wrap": 2,
                "reversed_y": True,
                "indep_x": True,
                "indep_y": True
            }
        }
    }

    fig = dxc.get_plot(image_df, cfg)

    assert "data" in fig

    subplot_names = [el["name"] for el in fig["data"]]
    expected = ['astronaut', 'cat', 'coffee']
    assert len(subplot_names) == len(expected)
    assert all([a == b for a, b in zip(subplot_names, expected)])


def test_multi_combined():

    cfg = {
        "plot": {
            "type": "imshow",
            "params": {
                "render": "interactive",
                "x": "X",
                "y": "Y",
                "dimensions": [
                    "R", "G", "B"
                ],
                "facet_col": "Name",
                "facet_col_wrap": 3,
                "reversed_y": True,
                "title": "OK"
            }
        }
    }

    fig = dxc.get_plot(image_df, cfg)

    assert "data" in fig

    print(fig)

    subplot_names = [el["name"] for el in fig["data"]]
    expected = ['R of astronaut', 'G of astronaut', 'B of astronaut', 'R of cat', 'G of cat', 'B of cat', 'R of coffee', 'G of coffee', 'B of coffee']
    assert len(subplot_names) == len(expected)
    assert all([a == b for a, b in zip(subplot_names, expected)])


def test_not_possible():

    cfg = {
        "plot": {
            "type": "imshow",
            "render": "interactive",
            "params": {
                "x": "X",
                "y": "Y",
                "dimensions": [
                    "not_available"
                ],
                "title": "OK"
            }
        }
    }

    fig = dxc.get_plot(image_df, cfg)

    assert "data" in fig


def test_colorscale():

    cfg = {
        "plot": {
            "type": "imshow",
            "render": "interactive",
            "params": {
                "x": "X",
                "y": "Y",
                "dimensions": [
                    "R", "G"
                ],
                "title": "OK",
                "colorscale": "greens"
            }
        }
    }

    fig = dxc.get_plot(image_df, cfg)

    assert "data" in fig    