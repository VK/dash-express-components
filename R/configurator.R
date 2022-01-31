# AUTO GENERATED FILE - DO NOT EDIT

#' @export
configurator <- function(id=NULL, config=NULL, meta=NULL, showFilter=NULL, showMetadata=NULL, showParameterization=NULL, showPlotter=NULL, showStore=NULL, showTransform=NULL, showUpdate=NULL) {
    
    props <- list(id=id, config=config, meta=meta, showFilter=showFilter, showMetadata=showMetadata, showParameterization=showParameterization, showPlotter=showPlotter, showStore=showStore, showTransform=showTransform, showUpdate=showUpdate)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Configurator',
        namespace = 'dash_express_components',
        propNames = c('id', 'config', 'meta', 'showFilter', 'showMetadata', 'showParameterization', 'showPlotter', 'showStore', 'showTransform', 'showUpdate'),
        package = 'dashExpressComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
