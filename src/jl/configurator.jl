# AUTO GENERATED FILE - DO NOT EDIT

export configurator

"""
    configurator(;kwargs...)

A Configurator component.
Configurator component
Keyword arguments:
- `id` (optional): The ID used to identify this component in Dash callbacks.
- `config` (optional): Prop The resulting configuration of the plot.
- `meta` (optional): The metadata the plotter selection is based on.
- `setProps` (optional): Dash-assigned callback that should be called to report property changes
to Dash, to make them available for callbacks.
- `showFilter` (optional): Prop to define the visibility of the Filter panel
- `showMetadata` (optional): Prop to define the visibility of the Metadata panel
- `showParameterization` (optional): Prop to define the visibility of the Parameterization panel
- `showPlotter` (optional): Prop to define the visibility of the Plot panel
- `showStore` (optional): Prop to define the visibility of the Store panel
- `showTransform` (optional): Prop to define the visibility of the Transform panel
- `showUpdate` (optional): Prop to define the visibility of the update plot button
"""
function configurator(; kwargs...)
        available_props = Symbol[:id, :config, :meta, :showFilter, :showMetadata, :showParameterization, :showPlotter, :showStore, :showTransform, :showUpdate]
        wild_props = Symbol[]
        return Component("configurator", "Configurator", "dash_express_components", available_props, wild_props; kwargs...)
end

