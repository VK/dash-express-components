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
            values: []
        }

        if ("config" in props) {
            this.state = {
                ...this.state,
                newColName: ("col" in props.config) ? props.config.col : "",
                selectedCol: ("incol" in props.config) ? props.config.incol : [],
                values: ("values" in props.config) ? Object.keys(props.config.values).map(k => '"' + k + '": ' + props.config.values[k]) : []
            };
        }

        this.editablelist_ref = React.createRef();
    }

    static config_to_string(el) {
        return <span><b>{el.col}</b> is <b>{el.incol}</b> after the lookup in {JSON.stringify(el.values, null, 2)}</span>
    }

    config_from_state(input) {

        let parsed_values = null;
        try {
            parsed_values = input.values.map((el) => JSON.parse("{" + el + "}")).reduce((k, v) => { return { ...k, ...v } }
                , {});
            console.log(parsed_values);
        } catch { }

        return {
            type: "catlookup",
            col: input.newColName,
            incol: input.selectedCol,
            values: parsed_values
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let col = input["col"];
        let incol = input["incol"];
        let values = input["values"];

        if (values == null) {
            return {
                value: 0, error: true, message: "Not able to parse your inputs!", type: undefined
            };
        }

        if (!(incol in current_meta)) {
            return {
                value: 0, error: true, message: "Input column not in metadata!", type: undefined
            };
        }

        let res = values[Object.keys(values)[0]];

        let type = {
            number: "numerical",
            boolean: "bool",
            string: "categorical",
            undefined: "?"
        }[String(typeof res)];


        let output = {
            value: res, error: false, message: "", type: type
        };

        let new_meta = { ...current_meta };
        new_meta[col] = SubComponentBase.get_dummy_meta_entry(type, res);
        output["new_meta"] = new_meta;

        return output;
    }


    render() {

        const {
            catColOptions,
            allOptions,
            meta
        } = this.state;

        let {
            newColName,
            selectedCol,
            values,
        } = this.state;

        return <div>

            <div className="color-helper-blue">Set the name of the new column with the lookup results.</div>
            <InputGroup className="mb-3" key="selectName">
                <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                <FormControl value={newColName} onChange={e => {
                    this.setStateConfig(
                        {
                            newColName: e.target.value,
                            selectedCol: selectedCol,
                            values: values
                        }
                    );
                }} />
            </InputGroup>

            <div className="color-helper-green">Select the column you want to use for the lookup.</div>
            <Select
                className="mb-3"
                key="selectCol"
                options={catColOptions}
                value={(selectedCol) ? allOptions.filter(el => selectedCol === el.value) : undefined}
                onChange={selectedOption => {

                    let new_config = {
                        newColName: newColName,
                        selectedCol: selectedOption.value
                    };
                    if (selectedOption.value in meta) {
                        if (meta[selectedOption.value]["type"] === "categorical") {
                            new_config["values"] = meta[selectedOption.value].cat.map((v) => '"' + v + '": 0');
                            this.editablelist_ref.current.setState({ list: new_config["values"] });
                        }
                    }
                    this.setStateConfig(new_config);
                }}
                isClearable
                styles={singleColorStyle}
                components={hideGroupComponents}
            />

            Define the new value for each category:
            <EditableList
                ref={this.editablelist_ref}
                list={values}
                className="w-100"
                onListChange={e => this.setStateConfig({
                    values: e,
                    newColName: newColName,
                    selectedCol: selectedCol
                })}
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