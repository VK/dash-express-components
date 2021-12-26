# AUTO GENERATED FILE - DO NOT EDIT

export ''_dashexpresscomponents

"""
    ''_dashexpresscomponents(;kwargs...)

A DashExpressComponents component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `label` (String; required): A label that will be printed when this component is rendered.
- `value` (String; optional): The value displayed in the input.
"""
function ''_dashexpresscomponents(; kwargs...)
        available_props = Symbol[:id, :label, :value]
        wild_props = Symbol[]
        return Component("''_dashexpresscomponents", "DashExpressComponents", "dash_express_components", available_props, wild_props; kwargs...)
end

