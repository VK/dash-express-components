import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks, singleColorStyle } from "./Base.react";


export default class FilterIqrTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            selectedCols: [],
            col: undefined,
            upper: undefined,
            lower: undefined
        }

        if ("config" in props) {
            this.state = {
                ...this.state,
                selectedCols: ("groupby" in props.config) ? props.config.groupby : [],
                col: ("col" in props.config) ? props.config.col : undefined,
                upper: ("upper" in props.config) ? props.config.upper : undefined,
                lower: ("lower" in props.config) ? props.config.lower : undefined,
            };
        }

    }

    static config_to_string(el) {
        if (el.groupby.length == 0) {
            return <span>IQR filter <b>{el.col}</b> without grouping.</span>
        } else {
            return <span>IQR filter <b>{el.col}</b> after grouping by {el.groupby.join(", ")}.</span>
        }
    }

    config_from_state(input) {
        return {
            type: "filteriqr",
            groupby: input.selectedCols,
            col: input.col,
            upper: (input.upper && input.upper.length > 0) ? input.upper : undefined,
            lower: (input.lower && input.lower.length > 0) ? input.lower : undefined
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

        if (!(input.col in current_meta)) {
            error = true;
            message = "Missing column " + input.col + "\n";
        }

        let output = {
            value: 0, error: error, message: message, type: "categorical", new_meta: current_meta
        };

        return output;
    }


    render() {

        const {
            selectedCols,
            col,
            catColOptions,
            numColOptions,
            allOptions,
            upper,
            lower
        } = this.state;

        return <div>


            <div className="color-helper-red mt-3">Select the columns to group the data</div>
            <Select
                className="mb-3"
                key="selectCols"
                options={catColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.setStateConfig({
                        ...s, col: col,
                        upper: upper,
                        lower: lower
                    }),
                    "selectedCols",
                    allOptions
                )}
            />


            <div className="color-helper-blue mt-2">Select the column to filter</div>
            <Select
                className="mb-3"
                key="col"
                options={numColOptions}
                styles={singleColorStyle}
                components={hideGroupComponents}
                value={allOptions.filter(o => o.value === col)[0]}

                onChange={selectedOption => {

                    let value = selectedOption.value;

                    this.setStateConfig(
                        {
                            col: value,
                            selectedCols: selectedCols,
                            upper: upper,
                            lower: lower
                        }
                    );

                }}
            />

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-lower-addon">lower</InputGroup.Text>
                <FormControl type="number"
                    key={"lower-value"}
                    value={lower} onChange={e => {
                        this.setStateConfig({
                            col: col,
                            selectedCols: selectedCols,
                            lower: e.target.value,
                            upper: upper
                        });
                    }} />

                <InputGroup.Text id="basic-upper-addon">upper</InputGroup.Text>
                <FormControl type="number"
                    key={"upper-value"}
                    value={upper} onChange={e => {
                        this.setStateConfig({
                            col: col,
                            selectedCols: selectedCols,
                            lower: lower,
                            upper: e.target.value
                        });
                    }} />
            </InputGroup>

        </div>

    }
}



FilterIqrTransform.defaultProps = {};

FilterIqrTransform.propTypes = {

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