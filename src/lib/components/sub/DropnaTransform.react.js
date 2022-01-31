import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from "./Base.react";


export default class DropnaTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            selectedCols: []
        }
    }

    static config_to_string(el) {
        return <span>Drop nan values from <b>[{el.subset.join(", ")}]</b>.</span>
    }

    config_from_state(input) {
        return {
            type: "dropna",
            subset: input.selectedCols
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let output = {
            value: 0, error: false, message: "", type: "categorical", new_meta: current_meta
        };

        return output;
    }


    render() {

        const {
            selectedCols,
            allColOptions,
            allOptions
        } = this.state;

        return <div>


            Select the columns you want to clean from nan values.


            <Select
                className="mb-3"
                key="selectCols"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.setStateConfig({ ...s}),
                    "selectedCols",
                    allOptions
                )}
            />


        </div>

    }
}



DropnaTransform.defaultProps = {};

DropnaTransform.propTypes = {

    /**
    * The config the user sets in this component.
    */
    config: PropTypes.any,

    /**
     * The metadata this section is based on.
     */
    meta: PropTypes.any.isRequired,

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