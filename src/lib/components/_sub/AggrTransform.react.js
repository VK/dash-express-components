import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from "./Base.react";

import Form from 'react-bootstrap/Form';


export default class AggrTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            groupby: [],
            cols: [],
            types: [],
        }

        if ("config" in props) {
            this.state = {
                ...this.state,
                groupby: ("groupby" in props.config) ? props.config.groupby : [],
                cols: ("cols" in props.config) ? props.config.cols : [],
                types: ("types" in props.config) ? props.config.types : []
            };
        }
    }

    static config_to_string(el) {
        return <span>Aggregate <b>[{el.cols.join(", ")}]</b> with [{el.types.join(", ")}]  </span>
    }

    static aggr_types = [
        { value: 'min', label: 'min' },
        { value: 'max', label: 'max' },
        { value: 'mean', label: 'mean' },
        { value: 'median', label: 'median' },
        { value: 'count', label: 'count' },
        { value: 'sum', label: 'sum' },
        { value: 'std', label: 'std' },
        { value: 'var', label: 'var' },
        { value: 'range', label: 'range' },
        { value: 'iqr', label: 'iqr' },

        { value: 'q01', label: '1th percentile' },
        { value: 'q05', label: '5th percentile' },
        { value: 'q25', label: '25th percentile' },
        { value: 'q75', label: '75th percentile' },
        { value: 'q95', label: '95th percentile' },
        { value: 'q99', label: '99th percentile' }
    ]

    config_from_state(input) {
        return {
            type: "aggr",
            groupby: input.groupby,
            cols: input.cols,
            types: input.types
        }
    }



    static eval(input) {

        let new_meta = {};

        let error = false;
        let message = "";

        input.groupby.forEach(el => {

            if (el in input.meta) {
                new_meta[el] = input.meta[el];
            } else {
                error = true;
                message += "Missing column " + el + " .\n";
            }

        });


        input.cols.forEach(c => {

            if (c in input.meta) {

                input.types.forEach(t => {
                    new_meta[c + "_" + t] = input.meta[c]
                })
            } else {
                error = true;
                message += "Missing column " + c + " .\n";
            }
        });

        return {
            error: error, message: message, new_meta: new_meta
        };
    }


    update_state(update_cfg) {
        let new_cfg = {
            groupby: this.state.groupby,
            cols: this.state.cols,
            types: this.state.types,
        }
        new_cfg = { ...new_cfg, ...update_cfg };

        this.setStateConfig(new_cfg);
    }



    render() {

        const {
            numColOptions,
            allColOptions,
            allOptions,

            groupby,
            cols,
            types,
            sep,
            suffix

        } = this.state;


        return <div>

            <div className="color-helper-red">Select the columns that should be used for the grouping.</div>
            <Select
                className="mb-3"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "groupby",
                    allOptions
                )}
            />

            <div className="color-helper-blue">Select the columns to aggregate.</div>
            <Select
                className="mb-3"
                options={numColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}
                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "cols",
                    allOptions
                )}
            />

            <div className="color-helper-green">Select the aggregation types.</div>
            <Select
                className="mb-3"
                options={AggrTransform.aggr_types}
                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "types",
                    AggrTransform.aggr_types
                )}
            />



        </div>

    }
}



AggrTransform.defaultProps = {};

AggrTransform.propTypes = {

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