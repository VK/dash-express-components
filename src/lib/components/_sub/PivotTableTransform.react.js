import React from 'react';
import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from "./Base.react";

import Form from 'react-bootstrap/Form';
import { values } from "ramda";
import { func } from "prop-types";


export default class PivotTableTransform extends SubComponentBase {
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
                values: ("values" in props.config) ? props.config.values : [],
                index: ("index" in props.config) ? props.config.index : [],
                columns: ("columns" in props.config) ? props.config.columns : [],
                aggfunc: ("aggfunc" in props.config) ? props.config.aggfunc : [],
            };
        }
    }
    static config_to_string(el) {
        let blocks = [];

        if (el.index.length > 0) {
            blocks.push(<>index {el.index.map((val, i) => <strong key={i}>{val}</strong>).reduce((prev, curr) => [prev, ', ', curr])}</>);
        }
        if (el.columns.length > 0) {
            blocks.push(<>columns {el.columns.map((val, i) => <strong key={i}>{val}</strong>).reduce((prev, curr) => [prev, ', ', curr])}</>);
        }
        if (el.values.length > 0) {
            blocks.push(<>values {el.values.map((val, i) => <strong key={i}>{val}</strong>).reduce((prev, curr) => [prev, ', ', curr])}</>);
        }

        let desc = <>Pivot Table with {blocks.reduce((prev, curr) => [prev, ' and ', curr])}</>;
        if (blocks.length > 2) {
            desc = <>Pivot Table with {blocks.reduce((prev, curr) => [prev, ', ', curr])}</>;
        }

        

        return <span>{desc}</span>;
    }
    

    static aggr_types = [
        { value: 'min', label: 'min' },
        { value: 'max', label: 'max' },
        { value: 'mean', label: 'mean' },
        { value: 'median', label: 'median' },
        { value: 'count', label: 'count' },
        { value: 'sum', label: 'sum' },
        // { value: 'std', label: 'std' },
        // { value: 'var', label: 'var' },
        // { value: 'range', label: 'range' },
        // { value: 'iqr', label: 'iqr' },

        // { value: 'q01', label: '1th percentile' },
        // { value: 'q05', label: '5th percentile' },
        // { value: 'q25', label: '25th percentile' },
        // { value: 'q75', label: '75th percentile' },
        // { value: 'q95', label: '95th percentile' },
        // { value: 'q99', label: '99th percentile' }
    ]

    config_from_state(input) {
        return {
            type: "pivot_table",
            index: this.state.index,
            columns: this.state.columns,
            values: this.state.values,
            aggfunc: this.state.aggfunc,
        }
    }



    static eval(input) {
        let new_meta = {};
        let error = false;
        let message = "";

        // Check if all values in input, values, and columns exist in the metadata
        const allKeys = [...input.index, ...input.columns, ...input.values];

        // Check if some keys appear multiple times and create a error message, that the key sould not appear multiple times
        const keyCount = allKeys.reduce((acc, key) => {
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const multipleKeys = Object.keys(keyCount).filter(key => keyCount[key] > 1);
        if (multipleKeys.length > 0) {
            error = true;
            message += `Keys ${multipleKeys.join(", ")} appear multiple times.\n`;
        }

        // if we have multiple columns, we need at least one index
        if (input.columns.length > 1 && input.index.length === 0) {
            error = true;
            message += `Multiple columns selected, but no index selected.\n`;
        }


        allKeys.forEach(key => {
            if (!(key in input.meta)) {
                error = true;
                message += `Missing column ${key}.\n`;
            }
        });

        // Check which pivot transforms should be made
        const has_columns = input.columns.length > 0;
        const has_aggfunc = input.aggfunc.length > 0;
        const has_margins = has_aggfunc;


        input.index.forEach(key => {
            new_meta[key] = input.meta[key];
        });


        // Generate column names
        const possible_column_values = has_columns
            ? input.columns.map(key => input.meta[key].cat) // Get unique categories for each column
            : [];

        const aggfuncs = has_aggfunc ? input.aggfunc : [null]; // Include aggfuncs only if available
        const values = input.values;



        if (has_columns) {
            // Generate all combinations of column values
            const generateCombinations = (arrays, prefix = []) => {
                if (!arrays.length) {
                    return [prefix];
                }
                const [first, ...rest] = arrays;
                return first.flatMap(value =>
                    generateCombinations(rest, [...prefix, value])
                );
            };

            const columnCombinations = generateCombinations(possible_column_values);

            // Create column names for each combination
            aggfuncs.forEach(aggfunc => {
                values.forEach(value => {
                    columnCombinations.forEach(combination => {
                        const columnName = [
                            aggfunc || "",
                            value,
                            ...combination
                        ]
                            .filter(Boolean) // Remove null/empty parts
                            .join("_");
                        new_meta[columnName] = input.meta[value];

                    });
                });
            });
        } else {
            // No columns, just generate names for aggfuncs and values
            aggfuncs.forEach(aggfunc => {
                values.forEach(value => {
                    const columnName = [aggfunc || "", value]
                        .filter(Boolean) // Remove null/empty parts
                        .join("_");
                    new_meta[columnName] = input.meta[value];
                });
            });
        }



        return {
            error: error,
            message: message,
            new_meta: new_meta
        };
    }


    update_state(update_cfg) {

        this.setState((prevState) => {
            let new_cfg = {
                index: prevState.index,
                columns: prevState.columns,
                values: prevState.values,
                aggfunc: prevState.aggfunc,
            };

            new_cfg = { ...new_cfg, ...update_cfg };

            this.setStateConfig(new_cfg);
            //what 0.1 seconds and then set the state again
            setTimeout(() => {
                this.setStateConfig(new_cfg);
            }, 100);


        });
    }



    render() {

        const {
            numColOptions,
            allColOptions,
            allOptions,
            catColOptions,




        } = this.state;


        return <div>

            <div className="color-helper-red">Keys to group as pivot table index.</div>
            <Select
                className="mb-3"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "index",
                    allOptions
                )}
            />

            <div className="color-helper-green">Keys to group as pivot table columns.</div>
            <Select
                className="mb-3"
                options={catColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}
                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "columns",
                    allOptions
                )}
            />

            <div className="color-helper-blue">Select values of the columns.</div>
            <Select
                className="mb-3"
                options={numColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}
                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "values",
                    allOptions
                )}
            />

            <div className="color-helper-blue">Select the aggregations.</div>
            <Select
                className="mb-3"
                options={PivotTableTransform.aggr_types}
                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "aggfunc",
                    PivotTableTransform.aggr_types
                )}
            />



        </div>

    }
}



PivotTableTransform.defaultProps = {};

PivotTableTransform.propTypes = {

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