# AUTO GENERATED FILE - DO NOT EDIT

export melttransform

"""
    melttransform(;kwargs...)

A MeltTransform component.

Keyword arguments:
- `allColOptions` (optional): All currently available column options
- `catColOptions` (optional): Currently available categorical options
- `config` (optional): The config the user sets in this component.
- `meta` (optional): The metadata this section is based on.
- `numColOptions` (optional): Currently available numerical options
- `setProps` (optional): Dash-assigned callback that should be called to report property changes
to Dash, to make them available for callbacks.
"""
function melttransform(; kwargs...)
        available_props = Symbol[:allColOptions, :catColOptions, :config, :meta, :numColOptions]
        wild_props = Symbol[]
        return Component("melttransform", "MeltTransform", "dash_express_components", available_props, wild_props; kwargs...)
end
