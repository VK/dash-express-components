import { isNil, pluck } from 'ramda';
import PlotterBase from "./PlotterBase.react";
import Select from 'react-select';
import InputGroup from 'react-bootstrap/InputGroup';



export default class ScatterMatrix extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.labels,
                this.option_dict.render
            ]

        }

        this.copy_params("scatter_matrix");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46">

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
            cx="13.130291"
            cy="35.273975"
            fill="#25fdfc"
            id="circle6" r="2.2445383" />
        <circle
            cx="14.127864"
            cy="30.784897"
            fill="#1d9bfb"
            id="circle8" r="2.2445383" />
        <circle
            cx="18.616938"
            cy="33.777615"
            fill="#25fdfc"
            id="circle10" r="2.2445383" />
        <circle
            cx="18.616938"
            cy="27.293394"
            fill="#25fdfc"
            id="circle12" r="2.2445383" />
        <circle
            cx="37.568863"
            cy="-25.367949"
            fill="#1d9bfb"
            id="circle4-8"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="34.849293"
            cy="-27.861879"
            fill="#25fdfc"
            id="circle6-0"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="30.452135"
            cy="-32.350956"
            fill="#1d9bfb"
            id="circle8-8"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="33.416035"
            cy="-29.358236"
            fill="#25fdfc"
            id="circle10-4"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="26.772167"
            cy="-35.842464"
            fill="#25fdfc"
            id="circle12-3"
            transform="rotate(90)" r="2.2445383" />
        <circle
            cx="-18.882193"
            cy="-25.283644"
            fill="#1d9bfb"
            id="circle4-8-2"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="-14.891905"
            cy="-27.777576"
            fill="#25fdfc"
            id="circle6-0-8"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="-13.894332"
            cy="-32.266655"
            fill="#1d9bfb"
            id="circle8-8-3"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="-9.4052563"
            cy="-29.273932"
            fill="#25fdfc"
            id="circle10-4-7"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="-9.4052563"
            cy="-35.758156"
            fill="#25fdfc"
            id="circle12-3-7"
            transform="matrix(0,-1,-1,0,0,0)" r="2.2445383" />
        <circle
            cx="9.1235075"
            cy="19.266541"
            fill="#1d9bfb"
            id="circle4-8-2-3" r="2.2445383" />
        <circle
            cx="13.113796"
            cy="15.104038"
            fill="#25fdfc"
            id="circle6-0-8-6" r="2.2445383" />
        <circle
            cx="14.111369"
            cy="13.944601"
            fill="#1d9bfb"
            id="circle8-8-3-7" r="2.2445383" />
        <circle
            cx="18.600445"
            cy="9.4716082"
            fill="#25fdfc"
            id="circle12-3-7-8" r="2.2445383" />

    </svg>)
    static label = "Scatter Matrix Plot";
    static type = "scatter_matrix";

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
            type: "scatter_matrix",
            params: params
        }
    }


    render() {
        const {
            allColOptions,
            catColOptions,
            numColOptions,
            optionsbar
        } = this.state;

        return (
            <div>
                {this.multiSelect("Dim", "dimensions", allColOptions)}
                {this.singleSelect("Color", "color", allColOptions)}
                {this.singleSelect("Symb.", "symbol", catColOptions)}
                {this.singleSelect("Size", "size", numColOptions)}

                {this.optionsBar(optionsbar)}
                {this.commonOptionBarControlls()}

            </div>
        );
    }

}



ScatterMatrix.defaultProps = {};

ScatterMatrix.propTypes = {

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
