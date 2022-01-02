import PlotterBase from "./PlotterBase.react";




export default class Imshow extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.facet
            ]

        }

        this.copy_params("imshow");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><path fill="#1d9bfb" d="M32 20h6v6h-6zm-12-6h6v6h-6zm-6 6h6v6h-6zm0 12h6v6h-6zm6 0h6v6h-6zm12 0h6v6h-6zm-6-12h6v6h-6z"></path><path fill="#25fdfc" d="M26 14h6v6h-6zm6 0h6v6h-6zm-12 6h6v6h-6zM8 20h6v6H8z"></path><path fill="#1d9bfb" d="M14 14h6v6h-6z"></path><path fill="#25fdfc" d="M8 14h6v6H8z"></path><path fill="#1d9bfb" d="M26 26h6v6h-6zM8 26h6v6H8z"></path><path fill="#25fdfc" d="M20 26h6v6h-6zm12 0h6v6h-6zm-18 0h6v6h-6zM26 8h6v6h-6z"></path><path fill="#1d9bfb" d="M8 8h6v6H8zm12 0h6v6h-6zm12 0h6v6h-6z"></path><path fill="#25fdfc" d="M14 8h6v6h-6zM8 32h6v6H8zm18 0h6v6h-6z"></path></svg>)
    static label = "2D Image";
    static type = "imshow";

    config_from_state(input) {
        let params = {
            ...this.base_config_from_state(),
            ...input
        };

        params = this.preferSimple(params);

        if ("hover_data" in params && typeof (params.hover_data) === "string") {
            params.hover_data = [params.hover_data];
        }

        return {
            type: "imshow",
            params: params
        }
    }


    render() {
        const {
            allColOptions,
            numColOptions
        } = this.state;

        return (

            <div key={"div-" + this.props.id}>
                {this.singleSelect("X", "x", numColOptions)}
                {this.singleSelect("Y", "y", numColOptions)}
                {this.multiSelect("Dim", "dimensions", allColOptions)}

                {this.optionsBar()}
                {this.commonOptionBarControlls()}

            </div>
        );
    }

}



Imshow.defaultProps = {};

Imshow.propTypes = {

    /**
    * The config the user sets in this component.
    */
    config: PropTypes.any,

    /**
     * All currently available column options
     */
    allColOptions: PropTypes.any.isRequired,

    /**
     * Currently available categorical options
     */
    catColOptions: PropTypes.any.isRequired,

    /**
    * Currently available numerical options
    */
    numColOptions: PropTypes.any.isRequired,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};
