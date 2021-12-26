# AUTO GENERATED FILE - DO NOT EDIT

''Configurator <- function(id=NULL, config=NULL, meta=NULL) {
    
    props <- list(id=id, config=config, meta=meta)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Configurator',
        namespace = 'dash_express_components',
        propNames = c('id', 'config', 'meta'),
        package = 'dashExpressComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
