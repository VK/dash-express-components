import { isNil, pluck } from 'ramda';
import PlotterBase from "./PlotterBase.react";
import Select from 'react-select';
import InputGroup from 'react-bootstrap/InputGroup';



export default class BarCount extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.axis,
                this.option_dict.labels,
                this.option_dict.render
            ]

        }

        this.copy_params("polygon");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46">
    <path
        fill="#1d9bfb"
        d="M 5.969152,39.019491 5.4132194,4.4367781 19.098644,4.6461002 Z"
        id="path14"/>
    <path
        fill="#1d9bfb"
        d="m 42.027226,32.935192 0.06577,9.999784 -19.999567,0.131537 -0.06577,-9.999784 z"
        id="path18" />
    <path
        fill="#25fdfc"
        d="m 15.562946,16.390849 14.677693,-4.472136 1.147323,9.933965 -5.869627,11.082514 -12.85098,1.146095 z"
        id="path20"/>
    </svg>)
    
    static label = "Polygon Plot";
    static type = "polygon";

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
            type: "polygon",
            params: params
        }
    }


    render() {
        const {
            catColOptions,
            numColOptions,
            allColOptions,
            optionsbar
        } = this.state;

        return (
            <div>
                {this.singleSelect("X", "x", numColOptions)}
                {this.singleSelect("Y", "y", numColOptions)}
                {this.singleSelect("IDX", "idx", numColOptions)}
                {this.singleSelect("Group", "groupby", catColOptions)}
                {this.singleSelect("Color", "color", allColOptions)}

                {this.optionsBar(optionsbar)}
                {this.commonOptionBarControlls()}

            </div>
        );
    }

}



BarCount.defaultProps = {};

BarCount.propTypes = {

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

