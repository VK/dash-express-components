# AUTO GENERATED FILE - DO NOT EDIT

export ''_configurator

"""
    ''_configurator(;kwargs...)

A Configurator component.
Configurator component
Keyword arguments:
- `id` (optional): The ID used to identify this component in Dash callbacks.
- `config` (optional): Prop The resulting configuration of the plot.
- `meta` (optional): The metadata the plotter selection is based on.
- `setProps` (optional): Dash-assigned callback that should be called to report property changes
to Dash, to make them available for callbacks.
"""
function ''_configurator(; kwargs...)
        available_props = Symbol[:id, :config, :meta]
        wild_props = Symbol[]
        return Component("''_configurator", "Configurator", "dash_express_components", available_props, wild_props; kwargs...)
end

