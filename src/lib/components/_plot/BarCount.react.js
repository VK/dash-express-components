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
                this.option_dict.facet,
                this.option_dict.axis,
                this.option_dict.render
            ]

        }

        this.copy_params("bar_count");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46">
        <path
            fill="none"
            d="M0 0h46v46H0z"
            id="path2" />
        <path
            fill="#25fdfc"
            d="M7 28h6v12H7z"
            id="path4" />
        <path
            fill="#1d9bfb"
            d="m 21,28 h -6 v 12 h 6 z M 38,10 h -6 v 30 h 6 z"
            id="path6" />
        <path
            fill="#25fdfc"
            d="M24 20h6v20h-6z"
            id="path8" />
        <path
            fill="#000000"
            d="m 9.8988084,10.063492 h 1.4821426 v 12 H 9.8988084 Z"
            id="path4-9"
        />
        <path
            fill="#000000"
            d="m 14.416664,10.063492 h 1.482143 v 12 h -1.482143 z"
            id="path4-9-8"
        />
        <path
            fill="#000000"
            d="m 18.898806,13.06349 v 1.482143 H 6.8988091 V 13.06349 Z"
            id="path4-9-9"
        />
        <path
            fill="#000000"
            d="m 18.898806,17.581348 v 1.482143 H 6.8988091 v -1.482143 z"
            id="path4-9-8-5"
        />
    </svg>)
    static label = "Bar Count Plot";
    static type = "bar_count";

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
            type: "bar_count",
            params: params
        }
    }


    render() {
        const {
            allColOptions,
            catColOptions,
            optionsbar
        } = this.state;

        return (
            <div>
                {this.multiSelect("X", "x", catColOptions)}
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

