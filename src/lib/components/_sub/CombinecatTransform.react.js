import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from "./Base.react";


export default class CombinecatTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            newColName: "",
            selectedCols: []
        }

        if ("config" in props) {
            this.state = {
                ...this.state,
                newColName: ("col" in props.config) ? props.config.col : [],
                selectedCols: ("cols" in props.config) ? props.config.cols : []
            };
        }
    }

    static config_to_string(el) {
        return <span><b>{el.col}</b> combines [{el.cols.join(", ")}]</span>
    }

    config_from_state(input) {
        return {
            type: "combinecat",
            col: input.newColName,
            cols: input.selectedCols
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let col = input["col"];
        let cols = input["cols"];

        let error = false;
        cols.forEach(k => {
            if (!(k in current_meta)) {
                error = true;
            }
        });

        if (error) {
            return { error: true, message: "Missing input columns" };
        }

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
            selectedCols,
            allColOptions,
            allOptions
        } = this.state;

        return <div>

            <div className="color-helper-blue">Choose the name of a new category.</div>
            <InputGroup className="mb-3" key="selectName">
                <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                <FormControl value={newColName} onChange={e => {
                    this.setStateConfig(
                        {
                            newColName: e.target.value,
                            selectedCols: selectedCols
                        }
                    );
                }} />
            </InputGroup>

            <div className="color-helper-green">Select the columns that should be grouped into a new cateogy.</div>
            <Select
                className="mb-3"
                key="selectCols"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.setStateConfig({ ...s, newColName: newColName }),
                    "selectedCols",
                    allOptions
                )}
            />


        </div>

    }
}



CombinecatTransform.defaultProps = {};

CombinecatTransform.propTypes = {

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