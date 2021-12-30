# AUTO GENERATED FILE - DO NOT EDIT

export ''_afterburner

"""
    ''_afterburner(;kwargs...)

An Afterburner component.

Keyword arguments:
- `id` (optional): The ID used to identify this component in Dash callbacks.
- `config` (optional): The config the user sets in this component.
- `meta` (optional): The metadata this section is based on.
- `meta_out` (optional): The metadata section will create as output.
- `setProps` (optional): Dash-assigned callback that should be called to report property changes
to Dash, to make them available for callbacks.
"""
function ''_afterburner(; kwargs...)
        available_props = Symbol[:id, :config, :meta, :meta_out]
        wild_props = Symbol[]
        return Component("''_afterburner", "Afterburner", "dash_express_components", available_props, wild_props; kwargs...)
end

