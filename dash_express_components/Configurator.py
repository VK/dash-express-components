# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class Configurator(Component):
    """A Configurator component.
Configurator component

Keyword arguments:

- id (optional):
    The ID used to identify this component in Dash callbacks.

- config (optional):
    Prop The resulting configuration of the plot.

- meta (optional):
    The metadata the plotter selection is based on.

- setProps (optional):
    Dash-assigned callback that should be called to report property
    changes to Dash, to make them available for callbacks.

- showFilter (default True):
    Prop to define the visibility of the Filter panel.

- showMetadata (default False):
    Prop to define the visibility of the Metadata panel.

- showParameterization (default False):
    Prop to define the visibility of the Parameterization panel.

- showPlotter (default True):
    Prop to define the visibility of the Plot panel.

- showStore (default False):
    Prop to define the visibility of the Store panel.

- showTransform (default True):
    Prop to define the visibility of the Transform panel."""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, meta=Component.UNDEFINED, config=Component.UNDEFINED, showFilter=Component.UNDEFINED, showTransform=Component.UNDEFINED, showPlotter=Component.UNDEFINED, showMetadata=Component.UNDEFINED, showParameterization=Component.UNDEFINED, showStore=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'config', 'meta', 'setProps', 'showFilter', 'showMetadata', 'showParameterization', 'showPlotter', 'showStore', 'showTransform']
        self._type = 'Configurator'
        self._namespace = 'dash_express_components'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'config', 'meta', 'setProps', 'showFilter', 'showMetadata', 'showParameterization', 'showPlotter', 'showStore', 'showTransform']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}
        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(Configurator, self).__init__(**args)
