# AUTO GENERATED FILE - DO NOT EDIT

''SubComponentBase <- function(allColOptions=NULL, catColOptions=NULL, config=NULL, meta=NULL, numColOptions=NULL) {
    
    props <- list(allColOptions=allColOptions, catColOptions=catColOptions, config=config, meta=meta, numColOptions=numColOptions)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'SubComponentBase',
        namespace = 'dash_express_components',
        propNames = c('allColOptions', 'catColOptions', 'config', 'meta', 'numColOptions'),
        package = 'dashExpressComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
