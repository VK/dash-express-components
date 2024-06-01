import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from './Graph.react';
import Plotly from 'plotly.js-dist';

class DataGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            defParams: props.defParams,
            meta: this.getMeta(props.data),
            figure: this.getFigure(props.defParams, props.data),
        };

        this.handleGraphSetProps = this.handleGraphSetProps.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.defParams !== this.props.defParams) {
            const figure = this.getFigure(this.props.defParams, this.props.data);
            this.setState({ defParams: this.props.defParams, figure });

            if (this.props.setProps) {
                this.props.setProps({ defParams: this.props.defParams, figure });
            }
        }

        if (prevProps.data !== this.props.data) {
            const meta = this.getMeta(this.props.data);
            const figure = this.getFigure(this.props.defParams, this.props.data);
            this.setState({ data: this.props.data, meta, figure });

            if (this.props.setProps) {
                this.props.setProps({ data: this.props.data, meta, figure });
            }
        }
    }

    handleGraphSetProps(updatedProps) {
        const figure = this.getFigure(updatedProps.defParams || this.state.defParams, updatedProps.data || this.state.data);
        if (this.props.setProps) {
            this.props.setProps({ ...updatedProps, figure });
        }
        this.setState({ ...updatedProps, figure });
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
            return {data: [], layout: {} };
        }

        const { type, params } = defParams.plot;
        const figure = { data: [], layout: {} };

        if (type === 'scatter') {
            const { x, y } = params;
            figure.data.push({
                x: data[x],
                y: data[y],
                mode: 'markers',
                type: 'scatter'
            });
        }

        if (type === 'table') {
            return data;
        }        
        // Add more plot types and logic as needed

        return figure;
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