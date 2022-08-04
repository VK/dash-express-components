import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiCallbacks, hideGroupComponents, multiColorStyle } from "./Base.react";
import EditableList from 'react-list-editable';


export default class AsType extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            selectedCol: undefined,
            values: []
        }

        if ("config" in props) {
            this.state = {
                ...this.state,
                selectedCol: ("incol" in props.config) ? props.config.incol : [],
                values: ("values" in props.config) ? Object.keys(props.config.values).map(k => '"' + k + '": "' + props.config.values[k] + '"') : []
            };
        }

        this.editablelist_ref = React.createRef();
    }

    static config_to_string(el) {
        return <span>Cast variables: <b>{JSON.stringify(el.values, null, 2)}</b></span>
    }

    config_from_state(input) {

        let parsed_values = null;
        try {
            parsed_values = input.values.map((el) => JSON.parse("{" + el + "}")).reduce((k, v) => { return { ...k, ...v } }
                , {});
        } catch { }

        return {
            type: "as_type",
            incol: input.selectedCol,
            values: parsed_values
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let incol = input["incol"];
        let values = input["values"];

        if (values == null) {
            return {
                value: 0, error: true, message: "Not able to parse your inputs!", type: undefined
            };
        }

        incol.forEach(c => {
            if (!(c in current_meta)) {
                return {
                    value: 0, error: true, message: "Input column not in metadata!", type: undefined
                };
            }
        })

        let output = {
            value: 1, error: false, message: "", type: "numerical"
        };

        let new_meta = { ...current_meta };

        for (const [key, value] of Object.entries(values)) {

            if (value === "int" || value === "float") {
                new_meta[key] = SubComponentBase.get_dummy_meta_entry("numerical", 123);
            } else if (value === "bool") {
                new_meta[key] = SubComponentBase.get_dummy_meta_entry("bool", true);
            } else if (value === "str") {
                new_meta[key] = SubComponentBase.get_dummy_meta_entry("categorical", "???");
            } else {
                new_meta[key] = SubComponentBase.get_dummy_meta_entry("?", "?");
            }

        }


        output["new_meta"] = new_meta;

        return output;
    }


    render() {

        const {
            allColOptions,
            allOptions,
            meta
        } = this.state;

        let {
            selectedCol,
            values,
        } = this.state;

        return <div>

            <div className="color-helper-green">Select the column you want to recast.</div>


            <Select
                className="mb-3"
                key="selectCol"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (selectedOption) => {

                        let new_config = {
                            ...selectedOption
                        };

                        let new_values = values.filter((e) => selectedOption.selectedCol.includes(e.split(":")[0]));
                        const known_values = values.map((e) => e.split(":")[0]);

                        selectedOption.selectedCol.forEach(element => {

                            if (!(element in known_values)) {
                                new_values.push('"' + element + '": "float"');
                            }

                        });

                        this.editablelist_ref.current.setState({ list: new_values });
                        new_config["values"] = new_values;

                        this.setStateConfig(new_config);
                    },
                    "selectedCol",
                    allOptions
                )}
            />

            Set the new dataformats like "int", "float", "str", "bool":
            <EditableList
                ref={this.editablelist_ref}
                list={values}
                className="w-100"
                onListChange={e => this.setStateConfig({
                    values: e,
                    selectedCol: selectedCol
                })}
                placeholder='Enter a value'
            />

        </div>

    }
}



AsType.defaultProps = {};

AsType.propTypes = {

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