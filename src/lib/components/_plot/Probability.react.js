import PlotterBase from "./PlotterBase.react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';



export default class Probability extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.facet,
                this.option_dict.axis_nocat
            ]

        }

        this.copy_params("probability");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><g fill="none"><path d="M0 0h46v46H0z"></path><path stroke="#25fdfc" d="M5.087 39l9.391-12.913 8.218 7.043L37.957 12" strokeMiterlimit="10" strokeWidth="2.348"></path><path stroke="#1d9bfb" d="M12.13 37.826l11.74-15.261 8.217 7.044 8.217-11.739" strokeMiterlimit="10" strokeWidth="2.348"></path></g></svg>)
    static label = "Probability plot";
    static type = "probability";

    config_from_state(input) {
        let params = {
            ...this.base_config_from_state(),

            ...input
        };

        params = this.preferSimple(params);

        return {
            type: "probability",
            params: params
        }
    }


    render() {
        const {
            catColOptions,
            numColOptions,
            optionsbar
        } = this.state;

        return (
            <div>
                {this.singleSelect("X", "x", numColOptions)}
                {this.singleSelect("Color", "color", catColOptions)}
                <ButtonGroup aria-label="show-fit-option" id="show-fit-option" className="w-100 mb-1">
                    {this.toggleSelect("Linear fit", "trendline", [null, "ols"])}
                </ButtonGroup>


                {this.optionsBar(optionsbar)}
                {this.commonOptionBarControlls()}


            </div>
        );
    }

}



Probability.defaultProps = {};

Probability.propTypes = {

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
