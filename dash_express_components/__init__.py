from __future__ import print_function as _
from .utils import *

import os as _os
import sys as _sys
import json

import dash as _dash
from dash import dash_table

# noinspection PyUnresolvedReferences
from ._imports_ import *
from ._imports_ import __all__

if not hasattr(_dash, '__plotly_dash') and not hasattr(_dash, 'development'):
    print('Dash was not successfully imported. '
          'Make sure you don\'t have a file '
          'named \n"dash.py" in your current directory.', file=_sys.stderr)
    _sys.exit(1)

_basepath = _os.path.dirname(__file__)
_filepath = _os.path.abspath(_os.path.join(_basepath, 'package-info.json'))
with open(_filepath) as f:
    package = json.load(f)

package_name = package['name'].replace(' ', '_').replace('-', '_')
__version__ = package['version']

_current_path = _os.path.dirname(_os.path.abspath(__file__))

_this_module = _sys.modules[__name__]

async_resources = [
    'graph', 'excel'
]

_js_dist = []

_js_dist.extend(
    [
        {
            "relative_package_path": "async-{}.js".format(async_resource),
            "external_url": (
                "https://unpkg.com/{0}@{2}"
                "/{1}/async-{3}.js"
            ).format(package_name, __name__, __version__, async_resource),
            "namespace": package_name,
            "async": True,
        }
        for async_resource in async_resources
    ]
)

# TODO: Figure out if unpkg link works
_js_dist.extend(
    [
        {
            "relative_package_path": "async-{}.js.map".format(async_resource),
            "external_url": (
                "https://unpkg.com/{0}@{2}"
                "/{1}/async-{3}.js.map"
            ).format(package_name, __name__, __version__, async_resource),
            "namespace": package_name,
            "dynamic": True,
        }
        for async_resource in async_resources
    ]
)

_js_dist.extend(
    [
        {
            'relative_package_path': 'dash_express_components.min.js',
            'external_url': 'https://unpkg.com/{0}@{2}/{1}/{1}.min.js'.format(
                package_name, __name__, __version__),
            'namespace': package_name
        },
        {
            'relative_package_path': 'dash_express_components.min.js.map',
            'external_url': 'https://unpkg.com/{0}@{2}/{1}/{1}.min.js.map'.format(
                package_name, __name__, __version__),
            'namespace': package_name,
            'dynamic': True
        }
    ]
)


_js_dist.extend(
    [
    {
        'relative_package_path': 'plotly.min.js',
        'external_url': (
            'https://unpkg.com/dash-core-components@{}'
            '/dash_core_components/plotly.min.js'
        ).format(__version__),
        'namespace': 'dash_core_components',
        'async': 'eager'
    },
    {
        'relative_package_path': 'async-plotlyjs.js',
        'external_url': (
            'https://unpkg.com/dash-core-components@{}'
            '/dash_core_components/async-plotlyjs.js'
        ).format(__version__),
        'namespace': 'dash_core_components',
        'async': 'lazy'
    },
    {
        'relative_package_path': 'async-plotlyjs.js.map',
        'external_url': (
            'https://unpkg.com/dash-core-components@{}'
            '/dash_core_components/async-plotlyjs.js.map'
        ).format(__version__),
        'namespace': 'dash_core_components',
        'dynamic': True
    }
    ]
)


_css_dist = []


for _component in __all__:
    setattr(locals()[_component], '_js_dist', _js_dist)
    setattr(locals()[_component], '_css_dist', _css_dist)
