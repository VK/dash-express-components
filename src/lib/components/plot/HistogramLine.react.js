import PlotterBase from "./PlotterBase.react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';



export default class HistogramLine extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.facet,
                this.option_dict.axis_nocat
            ]

        }

        this.histnorm_options = [
            { label: 'not normalized', value: undefined },
            { label: 'density', value: 'density' },
            { label: 'percent', value: 'percent' }
        ];

        this.copy_params("histogram_line");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><path fill="#25fdfc" d="M38 39V23l-11 4-9-3-11 3v12h31z"></path><path fill="#1d9bfb" d="M38 21l-11 4-9-3-11 3V14l14 5L38 7v14z"></path></svg>)
    static label = "Line Histogram";
    static type = "histogram_line";

    config_from_state(input) {
        let params = {
            ...this.base_config_from_state(),

            ...input
        };

        params = this.preferSimple(params);

        return {
            type: "histogram_line",
            params: params
        }
    }


    render() {
        const {
            catColOptions,
            numColOptions
        } = this.state;

        if (!("nbins" in this.state) || isNaN(this.state.nbins) || this.state.nbins == null || this.state.nbins == undefined) {
            this.setStateConfig({ nbins: 50 });
        }

        return (
            <div>
                {this.singleSelect("X", "x", numColOptions)}
                {this.singleSelect("Color", "color", catColOptions)}
                {this.singleSelect_ExtraOption("Norm", "histnorm", this.histnorm_options)}
                {this.range_ManualInputArray("# bins", "nbins", ["__nbins"])}
                <ButtonGroup aria-label="extra-hist-options" id="extra-hist-options" className="w-100 mb-1">
                    {this.toggleSelect("Cumulative", "cumulative", [null, true])}
                </ButtonGroup>



                {this.optionsBar()}
                {this.commonOptionBarControlls()}


            </div>
        );
    }

}



HistogramLine.defaultProps = {};

HistogramLine.propTypes = {

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
