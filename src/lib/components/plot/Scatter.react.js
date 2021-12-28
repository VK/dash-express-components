import { isNil, pluck } from 'ramda';
import PlotterBase from "./PlotterBase.react";
import Select from 'react-select';
import InputGroup from 'react-bootstrap/InputGroup';


export default class Scatter extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            x: [],
            y: [],
            color: [],
        }
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><circle cx="13" cy="32" r="3" fill="#1d9bfb"></circle><circle cx="21" cy="27" r="3" fill="#25fdfc"></circle><circle cx="23" cy="18" r="3" fill="#1d9bfb"></circle><circle cx="32" cy="24" r="3" fill="#25fdfc"></circle><circle cx="32" cy="11" r="3" fill="#25fdfc"></circle></svg>)
    static label = "Scatter Plot";
    static type = "scatter";

    config_from_state(input) {
        let params = {
            x: this.state.x,
            y: this.state.y,
            color: this.state.color,
            ...input
        };

        params = this.preferSimple(params);

        return {
            type: "scatter",
            params: params
        }
    }


    render() {
        const {
            allColOptions,
            x, y, color
        } = this.state;

        return (
            <div>


                {this.multiSelect("x", allColOptions)}
                {this.multiSelect("y", allColOptions)}
                {this.singleSelect("color", allColOptions)}


            </div>
        );
    }

}



Scatter.defaultProps = {};

Scatter.propTypes = {

    /**
    * The config the user sets in this component.
    */
    config: PropTypes.any,

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
