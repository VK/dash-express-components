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
            ]

        }

        this.copy_params("bar_count");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><path fill="#25fdfc" d="M7 28h6v12H7z"></path><path fill="#1d9bfb" d="M32 28h6v12h-6zM15 10h6v30h-6z"></path><path fill="#25fdfc" d="M24 20h6v20h-6z"></path></svg>)
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
            catColOptions
        } = this.state;

        return (
            <div>
                {this.multiSelect("X", "x", catColOptions)}
                {this.singleSelect("Color", "color", allColOptions)}

                {this.optionsBar()}
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

