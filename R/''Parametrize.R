# AUTO GENERATED FILE - DO NOT EDIT

''Parametrize <- function(id=NULL, config=NULL, meta=NULL, meta_out=NULL) {
    
    props <- list(id=id, config=config, meta=meta, meta_out=meta_out)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Parametrize',
        namespace = 'dash_express_components',
        propNames = c('id', 'config', 'meta', 'meta_out'),
        package = 'dashExpressComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
