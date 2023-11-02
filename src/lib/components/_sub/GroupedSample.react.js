import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks, singleColorStyle } from "./Base.react";


export default class GroupedSample extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            selectedCols: [],
            n: undefined
        }

        if ("config" in props) {
            this.state = {
                ...this.state,
                selectedCols: ("groupby" in props.config) ? props.config.groupby : [],
                n: ("n" in props.config) ? props.config.n : 10000,
            };
        }

    }

    static config_to_string(el) {
        if (el.groupby.length == 0) {
            return <span>Take <b>{el.n}</b> samples without grouping.</span>
        } else {
            return <span>Take <b>{el.n}</b> samples after grouping by {el.groupby.join(", ")}.</span>
        }
    }

    config_from_state(input) {
        return {
            type: "groupby_sample",
            groupby: input.selectedCols,
            n: input.n
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let error = false;
        let message = "";

        input.groupby.forEach(c => {
            if (!(c in current_meta)) {
                error = true;
                message = "Missing column " + c + "\n";
            }
        })

        let output = {
            value: 0, error: error, message: message, type: "categorical", new_meta: current_meta
        };

        return output;
    }


    render() {

        const {
            selectedCols,
            catColOptions,
            allOptions,
            n
        } = this.state;

        return <div>


            <div className="color-helper-blue mt-3">Select the columns to group the data</div>
            <Select
                className="mb-3"
                key="selectCols"
                options={catColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.setStateConfig({
                        ...s,
                        n: n
                    }),
                    "selectedCols",
                    allOptions
                )}
            />


            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-n-addon">n</InputGroup.Text>
                <FormControl type="number"
                    key={"n-value"}
                    value={n} onChange={e => {


                        function convertToInteger(value) {
                            if (typeof value === "string") {
                                const num = parseInt(value, 10);
                                return isNaN(num) ? 0 : num;
                            } else if (typeof value === "number") {
                                return Math.floor(value);
                            } else {
                                console.error("Invalid data type. Expected a number or a string representation of an integer.");
                                return 0;
                            }
                        }


                        this.setStateConfig({
                            selectedCols: selectedCols,
                            n: convertToInteger(e.target.value),
                        });
                    }} />
            </InputGroup>

        </div>

    }
}



GroupedSample.defaultProps = {};

GroupedSample.propTypes = {

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