import { Component } from 'react';

/**
 * CoreGraph just wraps the Graph of dash_core_components.
 * 
 */
export default class CoreGraph extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const PG = window.dash_core_components.Graph;

        return <PG {...this.props} setProps={el => this.props.setProps(el)} />
    }
}

CoreGraph.defaultProps = {
    id: null,
    figure: {
        data: [],
        layout: {},
        frames: [],
    }
}
CoreGraph.propTypes = {
    /**
     * The ID of this component, used to identify dash components
     * in callbacks. The ID needs to be unique across all of the
     * components in an app.
     * @type {string}
     */
    id: PropTypes.string,


    /**
     * Plotly `figure` object. See schema:
     * https://plotly.com/javascript/reference
     *
     * `config` is set separately by the `config` property
     */
    figure: PropTypes.any,

}