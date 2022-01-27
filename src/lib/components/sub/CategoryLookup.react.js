import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { singleColorStyle, hideGroupComponents } from "./Base.react";
import EditableList from 'react-list-editable';


export default class CategoryLookup extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            newColName: "",
            selectedCol: undefined,
            values: {}
        }
    }

    static config_to_string(el) {
        return <span><b>{el.col}</b> combines [{el.cols.join(", ")}]</span>
    }

    config_from_state(input) {
        return {
            type: "catlookup",
            col: input.newColName,
            incol: input.selectedCol,
            values: input.values

        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let col = input["col"];
        let cols = input["cols"];

        let res = cols.map(k => SubComponentBase.get_col_or_median(current_meta[k])).join("_");

        let output = {
            value: res, error: false, message: "", type: "categorical"
        };

        let new_meta = { ...current_meta };
        new_meta[col] = SubComponentBase.get_dummy_meta_entry("categorical", res);
        output["new_meta"] = new_meta;

        return output;
    }


    render() {

        const {
            newColName,
            selectedCol,
            catColOptions,
            allOptions,
            values,
            meta
        } = this.state;

        return <div>

            Set the name of the new column.
            <InputGroup className="mb-3" key="selectName">
                <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                <FormControl value={newColName} onChange={e => {
                    this.setStateConfig(
                        {
                            newColName: e.target.value,
                            selectedCol: selectedCol
                        }
                    );
                }} />
            </InputGroup>

            Select the column you want to use for the lookup.
            <Select
                className="mb-3"
                key="selectCol"
                options={catColOptions}
                value={(selectedCol) ? allOptions.filter(el => selectedCol === el.value) : undefined}
                onChange={selectedOption => {

                    let new_config = {
                        selectedCol: selectedOption.value
                    };
                    if (selectedOption.value in meta) {
                        if (meta[selectedOption.value]["type"] === "bool") {
                            new_config["values"] = { true: 1, false: 0 };
                        }
                        if (meta[selectedOption.value]["type"] === "categorical") {
                            new_config["values"] = meta[selectedOption.value].cat.reduce((a, v) => ({ ...a, [v]: 0 }), {})
                        }
                    }
                    this.setState(new_config);
                }}
                isClearable
                styles={singleColorStyle}
                components={hideGroupComponents}
            />

            Define the new value for each category:
            <EditableList
                list={Object.keys(values).map((k) => k + ": " + values[k])}
                className="w-100"
                onListChange={e => console.log(e)}
                placeholder='Enter a value'
            />

        </div>

    }
}



CategoryLookup.defaultProps = {};

CategoryLookup.propTypes = {

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