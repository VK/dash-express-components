import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks, singleColorStyle } from "./Base.react";


export default class StrSplitTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            newColName: "",
            selectedCol: undefined,
            sep: "_",
            start: 0,
            end: undefined
        }

        if ("config" in props) {
            this.state = {
                ...this.state,
                newColName: ("col" in props.config) ? props.config.col : "",
                selectedCol: ("in" in props.config) ? props.config.in : undefined,

                sep: ("sep" in props.config) ? props.config.sep : "_",
                start: ("start" in props.config) ? props.config.start : 0,
                end: ("end" in props.config) ? props.config.end : undefined,
            };
        }
    }

    static config_to_string(el) {
        return <span>Split <b>{el.in}</b> into <b>{el.col}</b>  </span>
    }

    config_from_state(input) {
        return {
            type: "strsplit",
            col: input.newColName,
            in: input.selectedCol,
            sep: input.sep,
            end: input.end,
            start: input.start
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let col = input["col"];
        let in_col = input["in"];
        let sep = input["sep"];
        let start = input["start"];
        let end = input["end"];

        if (!(in_col in current_meta)) {
            return { error: true, message: "Missing input columns" };
        }

        let res;
        if (sep === "") {
            res = current_meta[in_col].cat.map(el => el.substring(start, end));
        } else {
            res = current_meta[in_col].cat.map(el => el.split(sep)[start]);
        }

        let output = {
            value: "OK", error: false, message: "", type: "categorical"
        };

        let new_meta = { ...current_meta };
        new_meta[col] = {
            cat: [...new Set(res)],
            type: "categorical"
        }

        output["new_meta"] = new_meta;

        return output;
    }


    render() {

        const {
            newColName,
            selectedCol,
            catColOptions,
            sep,
            start,
            end
        } = this.state;

        return <div>

            <div className="color-helper-blue">Choose the name of a new column.</div>
            <InputGroup className="mb-3" key="selectName">
                <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                <FormControl value={newColName} onChange={e => {
                    this.setStateConfig(
                        {
                            newColName: e.target.value,
                            selectedCol: selectedCol,

                            sep: sep,
                            end: end,
                            start: start
                        }
                    );
                }} />
            </InputGroup>

            <div className="color-helper-green">Select the column that should be used for the string splitting.</div>
            <Select
                className="mb-3"
                key="selectCol"
                options={catColOptions}
                styles={singleColorStyle}
                components={hideGroupComponents}

                value={(selectedCol) ? this.props.allOptions.filter(el => selectedCol === el.value) : undefined}
                onChange={selectedOption => {
                    if (selectedOption) {
                        this.setStateConfig({
                            selectedCol: selectedOption.value,
                            newColName: newColName,
                            sep: sep,
                            end: end,
                            start: start
                        });
                    } else {
                        this.setStateConfig({
                            selectedCol: undefined,
                            newColName: newColName,
                            sep: sep,
                            end: end,
                            start: start
                        });
                    }
                }}
            />


            <div>Extract a substring via:</div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1" >Separator</InputGroup.Text>
                <FormControl value={sep} onChange={e => {
                    if (e.target.value === "") {
                        this.setStateConfig({
                            sep: "",
                            end: start + 1,
                            newColName: newColName,
                            selectedCol: selectedCol,
                            start: start
                        });
                    } else {
                        this.setStateConfig({
                            sep: e.target.value,
                            end: "",
                            newColName: newColName,
                            selectedCol: selectedCol,
                            start: start
                        });
                    }
                }} />


                <InputGroup.Text id="basic-addon2">Start</InputGroup.Text>
                <FormControl value={start} onChange={e => {

                    let new_value = parseInt(e.target.value);

                    if (isNaN(new_value)) {
                        this.setStateConfig({
                            start: "",
                            newColName: newColName,
                            selectedCol: selectedCol,
                            end: end,
                            sep: sep

                        });
                    } else {
                        this.setStateConfig({
                            start: new_value,
                            newColName: newColName,
                            selectedCol: selectedCol,
                            end: end,
                            sep: sep
                        });
                    }

                }} />


                <InputGroup.Text id="basic-addon2">End</InputGroup.Text>
                <FormControl value={end} onChange={e => {

                    let new_value = parseInt(e.target.value);

                    if (isNaN(new_value)) {
                        this.setStateConfig({
                            end: "",
                            newColName: newColName,
                            selectedCol: selectedCol,
                            start: start,
                            sep: sep
                        });
                    } else {
                        this.setStateConfig({
                            end: new_value,
                            sep: "",
                            newColName: newColName,
                            selectedCol: selectedCol,
                            start: start
                        });
                    }

                }} />



            </InputGroup>


        </div>

    }
}



StrSplitTransform.defaultProps = {};

StrSplitTransform.propTypes = {

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