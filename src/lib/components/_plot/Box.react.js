import { isNil, pluck } from 'ramda';
import PlotterBase from "./PlotterBase.react";
import Select from 'react-select';
import InputGroup from 'react-bootstrap/InputGroup';



export default class Box extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.facet,
                this.option_dict.axis,
                this.option_dict.labels,
                { id: "boxoptions", label: "Box options", visible: false, reset: { boxmode: [], points: [], aggr: [] } },
            ]

        }

        this.boxmode_options = [
            { label: 'Group', value: 'group' },
            { label: 'Overlay', value: 'overlay' }
        ];

        this.boxmode_options = [
            { label: 'Group', value: 'group' },
            { label: 'Overlay', value: 'overlay' }
        ];

        this.points_options = [
            { label: 'Outliers', value: 'outliers' },
            { label: 'Suspected outliers', value: 'suspectedoutliers' },
            { label: 'All points', value: 'all' },
            { label: 'No points', value: false }
        ];

        this.aggr_options = [
            { label: 'Mean', value: 'mean' },
            { label: 'Median', value: 'median' },
            { label: 'Count', value: 'count' },
            { label: 'Min', value: 'min' },
            { label: 'Max', value: 'max' },

            { label: 'IQR', value: 'iqr' },
            { label: 'Range', value: 'range' },

            { value: 'q01', label: '1th percentile' },
            { value: 'q05', label: '5th percentile' },
            { value: 'q25', label: '25th percentile' },
            { value: 'q75', label: '75th percentile' },
            { value: 'q95', label: '95th percentile' },
            { value: 'q99', label: '99th percentile' }            
        ];

        this.copy_params("box");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><path fill="none" stroke="#1d9bfb" d="M23 23v16m4 0h-8m8-16h-8m-8-12v24m4 0H7m8-24H7m28-2v24m4 0h-8m8-24h-8" strokeMiterlimit="10" strokeWidth="2"></path><path fill="#25fdfc" d="M8 18h6v10H8z"></path><path d="M13 19v8H9v-8h4m2-2H7v12h8V17z" fill="#1d9bfb"></path><path fill="#25fdfc" d="M20 29h6v4h-6z"></path><path d="M25 30v2h-4v-2h4m2-2h-8v6h8v-6z" fill="#1d9bfb"></path><path fill="#25fdfc" d="M32 14h6v14h-6z"></path><path d="M37 15v12h-4V15h4m2-2h-8v16h8V13z" fill="#1d9bfb"></path><path fill="none" stroke="#1d9bfb" d="M38 21h-6m-18 1H8" strokeMiterlimit="10" strokeWidth="2"></path></svg>)
    static label = "Box Plot";
    static type = "box";

    config_from_state(input) {
        let params = {
            ...this.base_config_from_state(),
            ...input
        };

        params = this.preferSimple(params);

        if ("hover_data" in params && typeof (params.hover_data) === "string") {
            params.hover_data = [params.hover_data];
        }

        return {
            type: "box",
            params: params
        }
    }


    render() {
        const {
            allColOptions,
            optionsbar
        } = this.state;

        return (
            <div>
                {this.multiSelect("X", "x", allColOptions)}
                {this.multiSelect("Y", "y", allColOptions)}
                {this.singleSelect("Color", "color", allColOptions)}

                {this.optionsBar(optionsbar)}
                {this.commonOptionBarControlls()}

                {optionsbar.filter(el => el.visible).map(el => {
                    if (el.id === "boxoptions") {
                        return <div>
                            <h5>{el.label}</h5>
                            {this.singleSelect_ExtraOption("Mode", "boxmode", this.boxmode_options)}
                            {this.singleSelect_ExtraOption("Points", "points", this.points_options)}
                            {this.multiSelect_ExtraOption("Stats", "aggr", this.aggr_options)}
                        </div>
                    }
                })}

            </div>
        );
    }

}



Box.defaultProps = {};

Box.propTypes = {

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

