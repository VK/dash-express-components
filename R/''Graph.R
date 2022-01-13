# AUTO GENERATED FILE - DO NOT EDIT

''Graph <- function(id=NULL, animate=NULL, animation_options=NULL, className=NULL, clear_on_unhover=NULL, clickAnnotationData=NULL, clickData=NULL, config=NULL, defParams=NULL, extendData=NULL, figure=NULL, hoverData=NULL, loading_state=NULL, prependData=NULL, relayoutData=NULL, responsive=NULL, restyleData=NULL, selectedData=NULL, style=NULL) {
    
    props <- list(id=id, animate=animate, animation_options=animation_options, className=className, clear_on_unhover=clear_on_unhover, clickAnnotationData=clickAnnotationData, clickData=clickData, config=config, defParams=defParams, extendData=extendData, figure=figure, hoverData=hoverData, loading_state=loading_state, prependData=prependData, relayoutData=relayoutData, responsive=responsive, restyleData=restyleData, selectedData=selectedData, style=style)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Graph',
        namespace = 'dash_express_components',
        propNames = c('id', 'animate', 'animation_options', 'className', 'clear_on_unhover', 'clickAnnotationData', 'clickData', 'config', 'defParams', 'extendData', 'figure', 'hoverData', 'loading_state', 'prependData', 'relayoutData', 'responsive', 'restyleData', 'selectedData', 'style'),
        package = 'dashExpressComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
