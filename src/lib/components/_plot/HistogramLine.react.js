import PlotterBase from "./PlotterBase.react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';



export default class HistogramLine extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.facet,
                this.option_dict.axis_nocat,
                this.option_dict.render
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


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><g fill="none"><path d="M0 0h46v46H0z"></path>
        <path
            stroke="#1d9bfb"
            d="m 5.087,39 9.391,-12.913 4.077014,3.019697 4.657285,-7.399839 2.107648,-10.250451 2.651337,14.787696 9.211266,12.672024"
            strokeMiterlimit="10"
            strokeWidth="2.348"
        />
        <path
            stroke="#25fdfc"
            d="m 9.8742411,38.916127 9.9944319,-15.325537 6.345412,6.463162 4.168085,-4.165906 9.953782,13.028281"
            strokeMiterlimit="10"
            strokeWidth="2.348"
        />
    </g>
    </svg>)
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
            numColOptions,
            optionsbar
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



                {this.optionsBar(optionsbar)}
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
