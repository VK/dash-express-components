
module DashExpressComponents
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.3"

include("jl/''_configurator.jl")
include("jl/''_filter.jl")
include("jl/''_graph.jl")
include("jl/''_localstore.jl")
include("jl/''_metacheck.jl")
include("jl/''_parametrize.jl")
include("jl/''_barcount.jl")
include("jl/''_box.jl")
include("jl/''_histogramline.jl")
include("jl/''_imshow.jl")
include("jl/''_plotterbase.jl")
include("jl/''_probability.jl")
include("jl/''_scatter.jl")
include("jl/''_scattermatrix.jl")
include("jl/''_table.jl")
include("jl/''_violin.jl")
include("jl/''_plotter.jl")
include("jl/''_base.jl")
include("jl/''_combinecattransform.jl")
include("jl/''_evaltransform.jl")
include("jl/''_melttransform.jl")
include("jl/''_subcomponentbase.jl")
include("jl/''_transform.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_express_components",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-graph.js",
    external_url = "https://unpkg.com/dash_express_components@0.0.3/dash_express_components/async-graph.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-graph.js.map",
    external_url = "https://unpkg.com/dash_express_components@0.0.3/dash_express_components/async-graph.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_express_components.min.js",
    external_url = "https://unpkg.com/dash_express_components@0.0.3/dash_express_components/dash_express_components.min.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_express_components.min.js.map",
    external_url = "https://unpkg.com/dash_express_components@0.0.3/dash_express_components/dash_express_components.min.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "plotly.min.js",
    external_url = "https://unpkg.com/dash-core-components@0.0.3/dash_core_components/plotly.min.js",
    dynamic = nothing,
    async = :eager,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-plotlyjs.js",
    external_url = "https://unpkg.com/dash-core-components@0.0.3/dash_core_components/async-plotlyjs.js",
    dynamic = nothing,
    async = :lazy,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-plotlyjs.js.map",
    external_url = "https://unpkg.com/dash-core-components@0.0.3/dash_core_components/async-plotlyjs.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
