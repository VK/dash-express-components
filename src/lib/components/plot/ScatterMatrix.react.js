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
                this.option_dict.labels
            ]

        }

        this.copy_params("scatter_matrix");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><circle cx="13" cy="32" r="3" fill="#1d9bfb"></circle><circle cx="21" cy="27" r="3" fill="#25fdfc"></circle><circle cx="23" cy="18" r="3" fill="#1d9bfb"></circle><circle cx="32" cy="24" r="3" fill="#25fdfc"></circle><circle cx="32" cy="11" r="3" fill="#25fdfc"></circle></svg>)
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
            numColOptions
        } = this.state;

        return (
            <div>
                {this.multiSelect("Dim", "dimensions", allColOptions)}
                {this.singleSelect("Color", "color", allColOptions)}
                {this.singleSelect("Symb.", "symbol", catColOptions)}
                {this.singleSelect("Size", "size", numColOptions)}

                {this.optionsBar()}
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
