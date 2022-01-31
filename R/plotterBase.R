# AUTO GENERATED FILE - DO NOT EDIT

#' @export
plotterBase <- function(id=NULL, allColOptions=NULL, catColOptions=NULL, config=NULL, numColOptions=NULL, numOptions=NULL) {
    
    props <- list(id=id, allColOptions=allColOptions, catColOptions=catColOptions, config=config, numColOptions=numColOptions, numOptions=numOptions)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'PlotterBase',
        namespace = 'dash_express_components',
        propNames = c('id', 'allColOptions', 'catColOptions', 'config', 'numColOptions', 'numOptions'),
        package = 'dashExpressComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
