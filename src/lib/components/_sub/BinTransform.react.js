import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form'
import Select from 'react-select';
import Alert from 'react-bootstrap/Alert';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from '../_sub/Base.react';

export default class BinTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            cols: [],
            name: "",
            binning: [],
            binning_string: "[]",
            overlapping: false,
            parse_error: false
        }


        if ("config" in props) {
            this.state = {
                ...this.state,
                cols: ("cols" in props.config) ? props.config.cols : [],
                name: ("name" in props.config) ? props.config.name : "",
                binning: ("binning" in props.config) ? props.config.binning : [],
                binning_string: ("binning" in props.config) ? JSON.stringify(props.config.binning) : "[]",
                overlapping: ("overlapping" in props.config) ? props.config.overlapping : false
            };
        }

    }

    static config_to_string(el) {
        return <span>Apply binning on <b>{el.cols.join(", ")}</b></span>
    }

    config_from_state(input) {
        return {
            type: "bin",
            cols: input.cols,
            name: input.name,
            binning: input.binning,
            overlapping: input.overlapping
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let cols = input["cols"];
        let binning = input["binning"];
        let name = input["name"];
        let overlapping = input["overlapping"];

        let error = false;
        let message = "";

        let output = {
            value: "", error: false, message: "", type: "categorical"
        };

        if (binning.length == 0) {
            output.error = true;
            output.message = "Please enter some bins";
            return output;
        }

        let one_dimensional = ("min" in binning[0]);

        let new_meta = { ...current_meta };

        if (overlapping) {
            if (one_dimensional) {

                if (cols.length > 1) {
                    cols.forEach(c =>
                        binning.forEach(b => {
                            new_meta[c + "_" + name + "_" + b.name] = { type: "bool" };
                        }));
                } else {
                    binning.forEach(b => {
                        new_meta[name + "_" + b.name] = { type: "bool" };
                    });
                }
            } else {
                // 2d
                binning.forEach(b => {
                    new_meta[name + "_" + b.name] = { type: "bool" };
                });
            }
        } else {
            let binlist = binning.map(el => el.name);
            if (one_dimensional) {

                if (cols.length > 1) {
                    cols.forEach(c => {
                        new_meta[c + "_" + name] = { type: "categorical", cat: binlist };
                    });
                } else {
                    new_meta[name] = { type: "categorical", cat: binlist };
                }

            } else {
                // 2d
                new_meta[name] = { type: "categorical", cat: binlist };
            }
        }

        output["new_meta"] = new_meta;


        return output;
    }


    render() {

        const {
            name,
            cols,
            binning,
            binning_string,
            overlapping,
            numColOptions,
            allOptions,
            parse_error
        } = this.state;

        let examples_needed = (binning.length < 1);

        return <div>

            <div className="color-helper-blue">Create a new or multiply colums by applying a binning scheme.</div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                <FormControl value={name} onChange={e => {
                    this.setStateConfig(
                        {
                            name: e.target.value,
                            cols: cols,
                            binning: binning,
                            overlapping: overlapping
                        }
                    );
                }} />
            </InputGroup>

            <div className="color-helper-green">Select the columns to bin:</div>

            <Select
                className="mb-3"
                options={numColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.setStateConfig({
                        ...s,
                        name: name,
                        binning: binning,
                        overlapping: overlapping
                    }),
                    "cols",
                    allOptions
                )}
            />


            <InputGroup className="mb-3">
                <InputGroup.Text className="color-helper-red" id="basic-addon1">Binning</InputGroup.Text>
                <FormControl as="textarea" rows={3} value={binning_string}
                    onChange={e => {

                        let new_state = {
                            name: name,
                            cols: cols,
                            binning: binning,
                            binning_string: e.target.value,
                            overlapping: overlapping,
                            parse_error: false
                        }

                        try {
                            let new_binning = JSON.parse(e.target.value);
                            new_state.binning = new_binning;

                        } catch {
                            new_state.parse_error = true;

                        }

                        this.setStateConfig(new_state);
                    }}
                />
            </InputGroup>

            <Form.Check
                type="checkbox"
                label="overlapping binning scheme"
                id="overlapping-binning-scheme-check"
                checked={overlapping}
                onChange={
                    e => {

                        this.setStateConfig(
                            {
                                name: name,
                                cols: cols,
                                binning: binning,
                                overlapping: e.target.checked
                            }
                        );


                    }
                }
                style={{ "marginTop": "-0.9rem" }}
            />



            {parse_error &&
                <Alert variant="warning">Please enter a valid binning JSON.</Alert>
            }

            {
                examples_needed && <div className="small text-muted">

                    <b>One dimensional example:</b>
                    <pre style={{ "marginBottom": "0" }}>{JSON.stringify([
                        { "min": 0, "max": 1.1, "name": "A" },
                        { "min": 1, "max": 2, "name": "B" }
                    ])}</pre>

                    <b>Two dimensional example:</b>
                    <pre style={{ "marginBottom": "-1.5rem" }}>{JSON.stringify(
                        [
                            { "points": [[0.0, 0.0], [10.0, 0.0], [10.0, 10.0]], "name": "C" }
                        ]
                    )}</pre>

                </div>
            }


        </div>

    }
}



BinTransform.defaultProps = {};

BinTransform.propTypes = {

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