import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from "./Base.react";
import EditableList from 'react-list-editable';


export default class RenameTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            selectedCols: [],
            values: []
        }

        if ("config" in props) {
            if ("columns" in props.config) {
                this.state = {
                    ...this.setState,
                    selectedCols: Object.keys(props.config.columns),
                    values: Object.keys(props.config.columns).map(k => '"' + k + '": "' + props.config.columns[k] + '"')
                }
            }
        }

        this.editablelist_ref = React.createRef();

    }

    static config_to_string(el) {
        return <span>Rename columns {JSON.stringify(el.columns, null, 2)}</span>
    }

    config_from_state(input) {

        let parsed_values = null;
        try {
            parsed_values = input.values.map((el) => JSON.parse("{" + el + "}")).reduce((k, v) => { return { ...k, ...v } }
                , {});
        } catch { }

        return {
            type: "rename",
            columns: parsed_values,
        }
    }


    static eval(input) {


        let current_meta = input["meta"];
        let columns = input["columns"];

        if (columns == null) {
            return {
                value: 0, error: true, message: "Not able to parse your inputs!", type: undefined
            };
        }

        let error = false;
        let message = "";

        Object.keys(columns).forEach(c => {
            if (!(c in current_meta)) {
                error = true;
                message = "Missing column " + c + "\n";
            }
        })

        let output = {
            value: 1, error: error, message: message, type: "categorical"
        };
        if (error) {
            return output;
        }

        let new_meta = { ...current_meta };

        for (const [key, value] of Object.entries(columns)) {

            new_meta[value] = new_meta[key];
            if (key !== value) {
                delete new_meta[key];
            }
        }
        output["new_meta"] = new_meta;

        return output;
    }


    render() {

        const {
            allColOptions,
            allOptions
        } = this.props;

        let {
            selectedCols,
            values,
        } = this.state;

        return <div>

            <div className="color-helper-green">Select the columns you want to rename:</div>
            <Select
                className="mb-3"
                key="selectCols"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => {

                        s["values"] = s.selectedCols.map((v) => '"' + v + '": "' + v + '"');
                        this.editablelist_ref.current.setState({ list: s["values"] });

                        this.setStateConfig(s);
                    },
                    "selectedCols",
                    allOptions
                )}
            />

            <div className="color-helper-blue">Define the new column names:</div>
            <EditableList
                ref={this.editablelist_ref}
                list={values}
                className="w-100"
                onListChange={e => this.setStateConfig({
                    values: e
                })}
                placeholder='Enter a value'
            />

        </div>

    }
}



RenameTransform.defaultProps = {};

RenameTransform.propTypes = {

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