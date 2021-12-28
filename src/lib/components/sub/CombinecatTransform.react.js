import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle } from "./Base.react";


export default class CombinecatTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            newColName: "",
            selectedCols: []
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
            allColOptions
        } = this.state;

        return <div>

            Select the name of a new category.
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

            Select the columns that should be grouped into a new cateogy.


            <Select
                className="mb-3"
                isMulti
                key="selectCols"

                options={allColOptions}

                value={allColOptions.filter(o => selectedCols.includes(o.value))}
                onChange={selectedOption => {
                    let value = selectedOption.map(el => el.value);

                    this.setStateConfig({
                        newColName: newColName,
                        selectedCols: value
                    });
                }}
                styles={multiColorStyle}
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