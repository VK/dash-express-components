# AUTO GENERATED FILE - DO NOT EDIT

export ''_violin

"""
    ''_violin(;kwargs...)

A Violin component.

Keyword arguments:
- `allColOptions` (optional): All currently available column options
- `catColOptions` (optional): Currently available categorical options
- `config` (optional): The config the user sets in this component.
- `numColOptions` (optional): Currently available numerical options
- `setProps` (optional): Dash-assigned callback that should be called to report property changes
to Dash, to make them available for callbacks.
"""
function ''_violin(; kwargs...)
        available_props = Symbol[:allColOptions, :catColOptions, :config, :numColOptions]
        wild_props = Symbol[]
        return Component("''_violin", "Violin", "dash_express_components", available_props, wild_props; kwargs...)
end

