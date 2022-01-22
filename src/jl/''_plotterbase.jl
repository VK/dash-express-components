# AUTO GENERATED FILE - DO NOT EDIT

export ''_plotterbase

"""
    ''_plotterbase(;kwargs...)

A PlotterBase component.

Keyword arguments:
- `allColOptions` (optional): All currently available column options
- `catColOptions` (optional): Currently available categorical options
- `config` (optional): The config the user sets in this component.
- `numColOptions` (optional): Currently available numerical options
- `numOptions` (optional): Currently available options without grouping
- `setProps` (optional): Dash-assigned callback that should be called to report property changes
to Dash, to make them available for callbacks.
"""
function ''_plotterbase(; kwargs...)
        available_props = Symbol[:allColOptions, :catColOptions, :config, :numColOptions, :numOptions]
        wild_props = Symbol[]
        return Component("''_plotterbase", "PlotterBase", "dash_express_components", available_props, wild_props; kwargs...)
end

