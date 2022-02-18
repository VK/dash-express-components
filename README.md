# Dash Express Components
![Publish release](https://github.com/VK/dash-express-components/workflows/Publish%20release/badge.svg)
[![PyPI](https://img.shields.io/pypi/v/dash-express-components?logo=pypi)](https://pypi.org/project/dash-express-components)
[![npm](https://img.shields.io/npm/v/dash_express_components.svg?logo=npm)](https://www.npmjs.com/package/dash_express_components)
[![Documentation](https://github.com/VK/dash-express-components/workflows/Documentation/badge.svg)](https://vk.github.io/dash-express-components)

## Widgets to bring [Plotly Express](https://plotly.com/python/plotly-express/) style plots to [Dash](https://dash.plotly.com/)

![example](https://raw.githubusercontent.com/VK/dash-express-components/main/examples/lumino/recording.gif)  
Example uses **[dash-lumino-components](https://github.com/VK/dash-lumino-components)** for MDI layout. 


## Try it
Install dependencies
```console
$ pip install dash-express-components
```
and start with quickly editable graphs:
```python
import dash_express_components as dxc
app.layout = html.Div([

    # add a plot dxc.Configurator
    html.Div([
        dxc.Configurator(
            id="plotConfig",
            meta=meta,
        ),
    ], style={"width": "500px", "float": "left"}),

    # add an editable dxc.Graph 
    html.Div([
        dxc.Graph(id="fig",
                  meta=meta,
                  style={"height": "100%", "width": "100%"}
                 )],
        style={"width": "calc(100% - 500px)", "height": "calc(100vh - 30px)",
               "display": "inline-block", "float": "left"}
    )
])
```

## Develop
1. Install npm packages
    ```console
    $ npm install
    ```
    
2. Create a virtual env and activate.
    ```console
    $ virtualenv venv
    $ . venv/bin/activate
    ```
    _Note: venv\Scripts\activate for windows_

3. Install python packages required to build components.
    ```console
    $ pip install -r requirements.txt
    ```

4. Build your code
    ```console
    $ npm run build
    ```

5. Run the example
    ```console
    $ python usage.py
    ```