import { Component } from 'react';

import PropTypes from 'prop-types';




/**
 * A config receiver listening for `window.postMessage()`
 * 
 * @hideconstructor
 * 
 * @example
 *  rec = dxc.ConfigReceiver(
 *           id="plotConfig",
 *           token="test"
 *  )
 * 
 *  window.postMessage({config: "Test", token:"test" })
 * @public
 */
class ConfigReceiver extends Component {
    constructor(props) {
        super(props);

        window.addEventListener("message", (event) => {

            if ("data" in event && "token" in event.data && event.data.token == this.props.token) {

                props.setProps({
                    config: event.data.config
                });
            }

        }, false);

    }

    render() {
        return ""
    }

}

/**
 * @typedef
 * @public
 * @enum {}
 */
ConfigReceiver.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * A token used to define the configuration across frames.
     * @type {string}
     */
    token: PropTypes.string.isRequired,

    /**
     * Prop The resulting configuration of the plot.
     * @type {Object}
     */
    config: PropTypes.any,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     * @private
     */
    setProps: PropTypes.func
}


/**
 * @private
 */
export default ConfigReceiver;
