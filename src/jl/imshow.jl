# AUTO GENERATED FILE - DO NOT EDIT

export imshow

"""
    imshow(;kwargs...)

An Imshow component.

Keyword arguments:
- `allColOptions` (optional): All currently available column options
- `catColOptions` (optional): Currently available categorical options
- `config` (optional): The config the user sets in this component.
- `numColOptions` (optional): Currently available numerical options
- `setProps` (optional): Dash-assigned callback that should be called to report property changes
to Dash, to make them available for callbacks.
"""
function imshow(; kwargs...)
        available_props = Symbol[:allColOptions, :catColOptions, :config, :numColOptions]
        wild_props = Symbol[]
        return Component("imshow", "Imshow", "dash_express_components", available_props, wild_props; kwargs...)
end

