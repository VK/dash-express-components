import pytest


def test_configurator():
    from dash_express_components.Configurator import Configurator
    with pytest.raises(TypeError):
        Configurator()


def test_filter():
    from dash_express_components.Filter import Filter
    with pytest.raises(TypeError):
        Filter()


def test_graph():
    from dash_express_components.Graph import Graph
    with pytest.raises(TypeError):
        Graph()


def test_localstore():
    from dash_express_components.Localstore import Localstore
    with pytest.raises(TypeError):
        Localstore()


def test_metacheck():
    from dash_express_components.MetaCheck import MetaCheck
    with pytest.raises(TypeError):
        MetaCheck()


def test_parameterize():
    from dash_express_components.Parameterize import Parameterize
    with pytest.raises(TypeError):
        Parameterize()


def test_plotter():
    from dash_express_components.Plotter import Plotter
    with pytest.raises(TypeError):
        Plotter()


def test_transform():
    from dash_express_components.Transform import Transform
    with pytest.raises(TypeError):
        Transform()
