import { isNil, pluck } from 'ramda';
import PlotterBase from "./PlotterBase.react";
import Select from 'react-select';
import InputGroup from 'react-bootstrap/InputGroup';



export default class Table extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
            ]

        }

        this.copy_params("table");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><path fill="#1d9bfb" d="M8 8h16v6H8z"></path><path fill="#fff" d="M8 14h16v6H8z"></path><path fill="#1d9bfb" d="M8 20h16v6H8z"></path><path fill="#fff" d="M8 26h16v6H8z"></path><path fill="#1d9bfb" d="M8 32h16v6H8zM26 8h12v6H26z"></path><path fill="#fff" d="M26 14h12v6H26z"></path><path fill="#1d9bfb" d="M26 20h12v6H26z"></path><path fill="#fff" d="M26 26h12v6H26z"></path><path fill="#1d9bfb" d="M26 32h12v6H26z"></path><path fill="none" stroke="#25fdfc" d="M21 11H11m10 12H11" strokeMiterlimit="10" strokeWidth="2"></path><path fill="none" stroke="#1d9bfb" d="M21 17H11m10 12H11" strokeMiterlimit="10" strokeWidth="2"></path><path fill="none" stroke="#25fdfc" d="M21 35H11m24-24h-6m6 12h-6" strokeMiterlimit="10" strokeWidth="2"></path><path fill="none" stroke="#1d9bfb" d="M35 17h-6m6 12h-6" strokeMiterlimit="10" strokeWidth="2"></path><path fill="none" stroke="#25fdfc" d="M35 35h-6" strokeMiterlimit="10" strokeWidth="2"></path><path fill="#1d9bfb" d="M24 8h2v30h-2z"></path><path fill="#25fdfc" d="M24 8h2v6h-2zm0 12h2v6h-2zm0 12h2v6h-2z"></path></svg>)
    static label = "Table";
    static type = "table";

    config_from_state(input) {
        let params = {
            ...this.base_config_from_state(),
            ...input
        };

        params = this.preferSimple(params);

        return {
            type: "table",
            params: params
        }
    }


    render() {
        const {
            allColOptions
        } = this.state;

        return (
            <div>
                {this.multiSelect("Dim", "dimensions", allColOptions)}
            </div>
        );
    }

}



Table.defaultProps = {};

Table.propTypes = {

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
