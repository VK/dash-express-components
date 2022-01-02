# AUTO GENERATED FILE - DO NOT EDIT

''Violin <- function(allColOptions=NULL, catColOptions=NULL, config=NULL, numColOptions=NULL) {
    
    props <- list(allColOptions=allColOptions, catColOptions=catColOptions, config=config, numColOptions=numColOptions)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Violin',
        namespace = 'dash_express_components',
        propNames = c('allColOptions', 'catColOptions', 'config', 'numColOptions'),
        package = 'dashExpressComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
