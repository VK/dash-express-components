import { isNil, pluck } from 'ramda';
import PlotterBase from "./PlotterBase.react";
import Select from 'react-select';
import InputGroup from 'react-bootstrap/InputGroup';



export default class Violin extends PlotterBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            optionsbar: [
                this.option_dict.facet,
                this.option_dict.axis,
                this.option_dict.labels,
                this.option_dict.render,
                { id: "boxoptions", label: "Violin options", visible: false, reset: { points: [] } }
            ]

        }


        this.points_options = [
            { label: 'Outliers', value: 'outliers' },
            { label: 'Suspected outliers', value: 'suspectedoutliers' },
            { label: 'All points', value: 'all' },
            { label: 'No points', value: false }
        ];



        this.copy_params("violin");
        this.init_check_options(true);
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path><path d="M7 21.733c0-6.22 4.412-8.674 4.412-13.968 0 5.294 4.411 7.749 4.411 13.968 0 4.756-4.411 7.267-4.411 17.561C11.412 29 7 26.49 7 21.734zm17.039 14.679s.434-5.754 1.856-8.467-.924-6.533.427-9.879a11.606 11.606 0 0 0 0-7.816C25.468 7.862 24.039 3 24.039 3s-1.43 4.862-2.283 7.25a11.606 11.606 0 0 0 0 7.816c1.351 3.346-.995 7.165.427 9.878s1.856 8.468 1.856 8.468zm12.991 3.882a11.821 11.821 0 0 0-2.344-6.03c-1.065-1.507-1.704-6.346-.639-8.549S37.03 12 37.03 12h-.058s1.917 11.512 2.982 13.715.426 7.042-.64 8.55a11.821 11.821 0 0 0-2.342 6.03zM24 36v6M37 3v9" fill="#25fdfc" stroke="#1d9bfb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>)
    static label = "Violin Plot";
    static type = "violin";

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
            type: "violin",
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
                            {this.singleSelect_ExtraOption("Points", "points", this.points_options)}
                        </div>
                    }
                })}

            </div>
        );
    }

}



Violin.defaultProps = {};

Violin.propTypes = {

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

