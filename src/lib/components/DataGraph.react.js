import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from './Graph.react';
import { none } from 'ramda';


class DataGraph extends Component {
    constructor(props) {
        super(props);

        const defParams = props.defParams || this.getDefaultDefParams(props.data);
        this.state = {
            data: props.data,
            defParams,
            meta: this.getMeta(props.data),
            figure: this.getFigure(defParams, props.data),
        };

        this.handleGraphSetProps = this.handleGraphSetProps.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.defParams !== this.props.defParams || prevProps.data !== this.props.data) {
            const defParams = this.props.defParams || this.getDefaultDefParams(this.props.data);
            const meta = this.getMeta(this.props.data);
            const figure = this.getFigure(defParams, this.props.data);

            this.setState({ defParams, data: this.props.data, meta, figure });

            if (this.props.setProps) {
                this.props.setProps({ defParams, data: this.props.data, meta, figure });
            }
        }
    }

    handleGraphSetProps(updatedProps) {
        const defParams = updatedProps.defParams || this.state.defParams;
        const data = updatedProps.data || this.state.data;

        // Check if defParams have changed
        const defParamsChanged = JSON.stringify(defParams) !== JSON.stringify(this.state.defParams);

        if (defParamsChanged) {
            const figure = this.getFigure(defParams, data);

            if (this.props.setProps) {
                this.props.setProps({ ...updatedProps, figure });
            }

            this.setState({ ...updatedProps, figure, defParams });
        } else {
            if (this.props.setProps) {
                this.props.setProps(updatedProps);
            }

            this.setState(updatedProps);
        }
    }

    getDefaultDefParams(data) {
        const dimensions = Object.keys(data);
        return {
            filter: [],
            transform: [],
            plot: {
                type: "table",
                params: {
                    dimensions
                }
            }
        };
    }

    getMeta(data) {
        const largeThreshold = 1000;

        function parseObjectCat(key) {
            const cat = [...new Set(data[key])];
            if (cat.length > largeThreshold) {
                return {
                    type: "categorical",
                    large: true,
                    cat: []
                };
            }
            return {
                type: "categorical",
                cat
            };
        }

        function parse(key, val) {
            if (val === "categorical") {
                const cat = [...new Set(data[key])];
                if (cat.length > largeThreshold) {
                    return {
                        type: "categorical",
                        large: true,
                        cat: []
                    };
                }
                return {
                    type: "categorical",
                    cat
                };
            } else if (val === "boolean") {
                return {
                    type: "boolean"
                };
            } else if (val === "temporal") {
                const values = data[key].filter(v => v != null).map(v => new Date(v));
                const min = new Date(Math.min.apply(null, values));
                const max = new Date(Math.max.apply(null, values));
                const median = new Date(values.sort((a, b) => a - b)[Math.floor(values.length / 2)]);
                return {
                    type: "temporal",
                    median,
                    min,
                    max
                };
            } else if (val === "numerical") {
                const values = data[key].filter(v => v != null).map(Number);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
                return {
                    type: "numerical",
                    median,
                    min,
                    max
                };
            } else {
                return parseObjectCat(key);
            }
        }

        return Object.keys(data).reduce((meta, key) => {
            const sampleValue = data[key][0];
            const dataType = typeof sampleValue;
            let inferredType;

            if (dataType === "string") {
                inferredType = isNaN(Date.parse(sampleValue)) ? "categorical" : "temporal";
            } else if (dataType === "boolean") {
                inferredType = "boolean";
            } else if (dataType === "number") {
                inferredType = "numerical";
            } else {
                inferredType = "categorical";
            }

            meta[key] = parse(key, inferredType);
            return meta;
        }, {});
    }

    getFigure(defParams, data) {
        console.log(defParams);
        if (!defParams || !defParams.plot || !defParams.plot.params) {
            return { data: [], layout: {} };
        }
    
        const { type, params } = defParams.plot;
        const figure = { data: [], layout: {} };
    
        if (type === 'scatter') {
            const {
                x, y, color, symbol, size, facet_col, facet_row, facet_col_wrap,
                log_x, log_y, reversed_x, reversed_y, cat_x, cat_y, range_x, range_y,
                indep_x, indep_y
            } = params;
    
            // Helper function to create scatter traces
            const createScatterTrace = (group, name, xaxis = 'x', yaxis = 'y') => {
                const scatterPlot = {
                    x: group.data[x],
                    y: group.data[y],
                    mode: 'markers',
                    type: 'scatter',
                    name,
                    xaxis,
                    yaxis
                };
    
                if (color) {
                    if (this.isNumerical(data[color])) {
                        scatterPlot.marker = { color: group.data[color] };
                    } else {
                        scatterPlot.marker = { color: group.name };
                    }
                }
            
                if (symbol) scatterPlot.marker = { ...scatterPlot.marker, symbol: group.data.symbol };
                if (size) scatterPlot.marker = { ...scatterPlot.marker, size: group.data.size };
                if (cat_x) scatterPlot.x = group.data[cat_x];
                if (cat_y) scatterPlot.y = group.data[cat_y];
            
                return scatterPlot;
            };
    
            // Handle faceting
            if (facet_col || facet_row) {
                const groupedData = this.groupData(data, { color, facet_col, facet_row });
                const rowValues = facet_row ? [...new Set(data[facet_row])] : [null];
                const colValues = facet_col ? [...new Set(data[facet_col])] : [null];
                let num_of_rows = rowValues.length;
                let num_of_cols = colValues.length;
    
                // Handle facet_col_wrap
                if (facet_col_wrap && !facet_row) {
                    num_of_rows = Math.ceil(num_of_cols / facet_col_wrap);
                    num_of_cols = Math.min(num_of_cols, facet_col_wrap);
                }
    
                // Initialize grid layout
                figure.layout.grid = {
                    rows: num_of_rows,
                    columns: num_of_cols,
                    subplots: [],
                    roworder: 'bottom to top',
                    pattern: (indep_x || indep_y) ? 'independent' : none
                };
    
                let traceIndex = 0;
    
                rowValues.forEach((rowVal, rowIndex) => {
                    for (let colIndex = 0; colIndex < colValues.length; colIndex++) {
                        const currentRowIndex = Math.floor(traceIndex / num_of_cols);
                        const currentColIndex = traceIndex % num_of_cols;
                        const colVal = colValues[colIndex];
    
                        const group = groupedData.find(g => (
                            (!rowVal || g.row === rowVal) &&
                            (!colVal || g.col === colVal)
                        )) || { data: { [x]: [], [y]: [] }, name: `${rowVal}-${colVal}` };
    
                        const trace = createScatterTrace(
                            group,
                            group.colorName,  // Use the color group name
                            `x${currentColIndex + 1 === 1 ? '' : currentColIndex + 1}`,
                            `y${currentRowIndex + 1 === 1 ? '' : currentRowIndex + 1}`
                        );
                        figure.data.push(trace);
                        if (!figure.layout.grid.subplots[currentRowIndex]) {
                            figure.layout.grid.subplots[currentRowIndex] = [];
                        }
                        figure.layout.grid.subplots[currentRowIndex][currentColIndex] = `${trace.xaxis}${trace.yaxis}`;
                        traceIndex++;
                    }
                });
            } else {
                const groupedData = this.groupData(data, { color });
                groupedData.forEach(group => {
                    const trace = createScatterTrace(group, group.colorName);  // Use the color group name
                    figure.data.push(trace);
                });
            }
    
            if (log_x) figure.layout.xaxis = { type: 'log' };
            if (log_y) figure.layout.yaxis = { type: 'log' };
            if (reversed_x) figure.layout.xaxis = { ...figure.layout.xaxis, autorange: 'reversed' };
            if (reversed_y) figure.layout.yaxis = { ...figure.layout.yaxis, autorange: 'reversed' };
            if (range_x) figure.layout.xaxis = { ...figure.layout.xaxis, range: range_x };
            if (range_y) figure.layout.yaxis = { ...figure.layout.yaxis, range: range_y };
        }
    
        if (type === 'table') {
            return data;
        }
        // Add more plot types and logic as needed
    
        return figure;
    }
    
    groupData(data, params) {
        const { color, facet_col, facet_row } = params;
        const groupByCols = [color, facet_col, facet_row].filter(Boolean);
    
        if (groupByCols.length === 0) {
            return [{ data, name: 'default', colorName: null }];
        }
    
        const groupedData = {};
        const groupKeys = {};
    
        data[Object.keys(data)[0]].forEach((_, idx) => {
            const groupKey = groupByCols.map(col => data[col][idx]).join('-');
    
            if (!groupedData[groupKey]) {
                groupedData[groupKey] = {};
                Object.keys(data).forEach(k => groupedData[groupKey][k] = []);
            }
    
            Object.keys(data).forEach(k => groupedData[groupKey][k].push(data[k][idx]));
    
            if (!groupKeys[groupKey]) {
                groupKeys[groupKey] = {
                    name: groupKey,
                    colorName: color ? data[color][idx] : null,
                    row: facet_row ? data[facet_row][idx] : null,
                    col: facet_col ? data[facet_col][idx] : null
                };
            }
        });
    
        return Object.keys(groupedData).map(key => ({
            data: groupedData[key],
            name: groupKeys[key].name,
            colorName: groupKeys[key].colorName,
            col: groupKeys[key].col,
            row: groupKeys[key].row
        }));
    }
    
    isNumerical(column) {
        return typeof column[0] === 'number';
    }

    render() {
        return (
            <Graph
                id={this.props.id}
                defParams={this.state.defParams}
                meta={this.state.meta}
                figure={this.state.figure}
                setProps={this.handleGraphSetProps}
            />
        );
    }
}

/**
 * @typedef
 * @public
 * @enum {}
 */
DataGraph.propTypes = {
    id: PropTypes.string.isRequired,
    defParams: PropTypes.object,
    data: PropTypes.object,
    setProps: PropTypes.func,
};

DataGraph.defaultProps = {
    data: {}
};

/**
 * @private
 */
export default DataGraph;