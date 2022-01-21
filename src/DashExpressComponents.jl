
module DashExpressComponents
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.5"

include("jl/configurator.jl")
include("jl/filter.jl")
include("jl/graph.jl")
include("jl/localstore.jl")
include("jl/metacheck.jl")
include("jl/parametrize.jl")
include("jl/plotter.jl")
include("jl/transform.jl")
include("jl/barcount.jl")
include("jl/box.jl")
include("jl/histogramline.jl")
include("jl/imshow.jl")
include("jl/plotterbase.jl")
include("jl/probability.jl")
include("jl/scatter.jl")
include("jl/scattermatrix.jl")
include("jl/table.jl")
include("jl/violin.jl")
include("jl/base.jl")
include("jl/combinecattransform.jl")
include("jl/evaltransform.jl")
include("jl/melttransform.jl")
include("jl/subcomponentbase.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_express_components",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-graph.js",
    external_url = "https://unpkg.com/dash_express_components@0.0.5/dash_express_components/async-graph.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-graph.js.map",
    external_url = "https://unpkg.com/dash_express_components@0.0.5/dash_express_components/async-graph.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_express_components.min.js",
    external_url = "https://unpkg.com/dash_express_components@0.0.5/dash_express_components/dash_express_components.min.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_express_components.min.js.map",
    external_url = "https://unpkg.com/dash_express_components@0.0.5/dash_express_components/dash_express_components.min.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "plotly.min.js",
    external_url = "https://unpkg.com/dash-core-components@0.0.5/dash_core_components/plotly.min.js",
    dynamic = nothing,
    async = :eager,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-plotlyjs.js",
    external_url = "https://unpkg.com/dash-core-components@0.0.5/dash_core_components/async-plotlyjs.js",
    dynamic = nothing,
    async = :lazy,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-plotlyjs.js.map",
    external_url = "https://unpkg.com/dash-core-components@0.0.5/dash_core_components/async-plotlyjs.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
