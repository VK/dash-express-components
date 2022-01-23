import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from '../sub/Base.react';

export default class MeltTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            newColName: "",
            newColName: "",
            selectedCols: []
        }
    }

    static config_to_string(el) {
        return <span><b>{el.col}</b> and <b>{el.col2}</b> melted from [{el.cols.join(", ")}]</span>
    }

    config_from_state(input) {
        return {
            type: "melt",
            col: input.newColName,
            col2: input.newColNameTwo,
            cols: input.selectedCols
        }
    }


    static eval(input) {
        let current_meta = input["meta"];

        let col = input["col"];
        let col2 = input["col2"];
        let cols = input["cols"];

        let res = cols.map(k => SubComponentBase.get_col_or_median(current_meta[k])).join("_");

        let output = {
            value: res, error: false, message: "", type: "categorical"
        };

        let new_meta = { ...current_meta };

        let var_col = SubComponentBase.get_dummy_meta_entry("categorical", res);
        var_col.cat = cols;
        let val_col = new_meta[cols[0]];

        cols.forEach(el => {
            delete new_meta[el];
        });
        new_meta[col2] = var_col;
        new_meta[col] = val_col;

        output["new_meta"] = new_meta;

        return output;
    }


    render() {

        const {
            newColName,
            newColNameTwo,
            selectedCols,
            allColOptions,
            allOptions
        } = this.state;

        return <div>

            Select the name of a new columns.
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Value</InputGroup.Text>
                <FormControl value={newColName} onChange={e => {
                    this.setStateConfig(
                        {
                            newColName: e.target.value,
                            newColNameTwo: newColNameTwo,
                            selectedCols: selectedCols
                        }
                    );
                }} />
                <InputGroup.Text id="basic-addon2">Type</InputGroup.Text>
                <FormControl value={newColNameTwo} onChange={e => {
                    this.setStateConfig(
                        {
                            newColName: newColName,
                            newColNameTwo: e.target.value,
                            selectedCols: selectedCols
                        }
                    );
                }} />
            </InputGroup>

            Select the columns that should be combined:


            <Select
                className="mb-3"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.setStateConfig({
                        ...s,
                        newColName: newColName,
                        newColNameTwo: newColNameTwo
                    }),
                    "selectedCols",
                    allOptions
                )}
            />


        </div>

    }
}



MeltTransform.defaultProps = {};

MeltTransform.propTypes = {

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