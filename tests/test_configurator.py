import dash
from dash import html, Input, Output
import dash_express_components as dxc
import plotly.express as px
from selenium.webdriver.common.by import By
import json
import time

from dash_express_components.Configurator import Configurator


df = px.data.gapminder()
meta = dxc.get_meta(df)


# Create a boxplot config
def test_configurator(dash_duo):

    app = dash.Dash(
        external_stylesheets=[
            "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"]
    )
    app.layout = html.Div([
        dxc.Configurator(id="configurator", meta=meta),
        html.Pre([html.Code("EMPTY", id='output')])
    ])

    @app.callback(
        Output('output', 'children'), Input('configurator', 'config')
    )
    def update_plot_config(newConfig):
        return json.dumps(newConfig, indent=2)   

    dash_duo.start_server(app)

    configurator = dash_duo.wait_for_element("#configurator")
    
    filter_button = dash_duo.wait_for_element("#configurator > div:nth-child(1) > h2 > button")
    filter_button.click()

    transform_button = dash_duo.wait_for_element("#configurator > div:nth-child(2) > h2 > button")
    transform_button.click()

    plotter_button = dash_duo.wait_for_element("#configurator > div:nth-child(3) > h2 > button")
    new_plot_button = dash_duo.wait_for_element("#configurator > div:nth-child(4) > h2 > div > button")
    

    plot_type_modal_button = dash_duo.wait_for_element("#configurator > div:nth-child(3) > div > div > div > button")
    plot_type_modal_button.click()

    plot_type_button = dash_duo.wait_for_element("div.modal-body > div > button:nth-child(2)")
    plot_type_button.click()

    #configurator-plotterplottype-box-select-x > div > div > div > input
    #react-select-12-input

    x_input = dash_duo.wait_for_element("#configurator-plotterplottype-box-select-x > div > div > div> input")
    x_input.send_keys("country")
    dash_duo.wait_for_element("#configurator-plotterplottype-box-group-text-x").click()

    y_input = dash_duo.wait_for_element("#configurator-plotterplottype-box-select-y > div > div > div> input")
    y_input.send_keys("lifeExp")
    dash_duo.wait_for_element("#configurator-plotterplottype-box-group-text-y").click()

    
    new_plot_button.click()

    output_config = json.loads(dash_duo.find_element('#output').text)

    assert "box" == output_config["plot"]["type"]
    assert "country" == output_config["plot"]["params"]["x"]
    assert "lifeExp" == output_config["plot"]["params"]["y"]



