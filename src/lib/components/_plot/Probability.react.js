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


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><g fill="none">
        <path
            fill="none"
            d="M0 0h46v46H0z"
            id="path2" />
        <circle
            cx="9.1400013"
            cy="37.767906"
            fill="#1d9bfb"
            id="circle4" r="2.2445383" />
        <circle
            cx="16.357166"
            cy="37.855476"
            fill="#25fdfc"
            id="circle6" r="2.2445383" />
        <circle
            cx="13.547027"
            cy="32.204723"
            fill="#1d9bfb"
            id="circle8" r="2.2445383" />
        <circle
            cx="17.197111"
            cy="33.390388"
            fill="#25fdfc"
            id="circle10" r="2.2445383" />
        <circle
            cx="19.068701"
            cy="29.358595"
            fill="#25fdfc"
            id="circle12" r="2.2445383" />
        <circle
            cx="22.983383"
            cy="-24.980724"
            fill="#1d9bfb"
            id="circle4-8"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="24.200602"
            cy="-23.279715"
            fill="#25fdfc"
            id="circle6-0"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="20.190668"
            cy="-28.995005"
            fill="#1d9bfb"
            id="circle8-8"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="21.218443"
            cy="-27.228498"
            fill="#25fdfc"
            id="circle10-4"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="18.575901"
            cy="-31.324839"
            fill="#25fdfc"
            id="circle12-3"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="-25.981319"
            cy="-21.282318"
            fill="#1d9bfb"
            id="circle4-8-2"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="-17.185747"
            cy="-32.073044"
            fill="#1d9bfb"
            id="circle8-8-3"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="-15.342709"
            cy="-34.953236"
            fill="#25fdfc"
            id="circle10-4-7"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="-9.9215565"
            cy="-35.887234"
            fill="#25fdfc"
            id="circle12-3-7"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="32.550629"
            cy="12.490101"
            fill="#1d9bfb"
            id="circle4-8-2-3" r="2.2445383" />
        <circle
            cx="17.402782"
            cy="28.917307"
            fill="#1d9bfb"
            id="circle8-8-3-7" r="2.2445383" />

    </g></svg>)
    static label = "Probability Plot";
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
