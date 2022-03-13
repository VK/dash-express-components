import dash_express_components as dxc
import plotly.express as px
import datetime
import pandas as pd

df = px.data.gapminder()


def test_get_meta():
    pandas_df = df.copy()
    pandas_df["time"] = datetime.datetime.now()
    pandas_df["bool"] = True
    pandas_df["continent"] = pandas_df["continent"].astype("category")

    meta = dxc.get_meta(pandas_df)

    meta_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "pop",
        "gdpPercap",
        "iso_alpha",
        "iso_num",
        "time",
        "bool"
    ]

    for col in meta_cols:
        assert col in meta


def test_get_meta_dask():
    from dask.dataframe import from_pandas

    dd = from_pandas(df,  npartitions=3)

    meta = dxc.get_meta_dask(dd)

    meta_cols = [
        "country",
        "continent",
        "year",
        "lifeExp",
        "pop",
        "gdpPercap",
        "iso_alpha",
        "iso_num"
    ]

    for col in meta_cols:
        assert col in meta
