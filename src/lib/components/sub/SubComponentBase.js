import { Component } from 'react';


export default class SubComponentBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            meta: props.meta,
            allColOptions: props.allColOptions,
            numColOptions: props.numColOptions,
            catColOptions: props.catColOptions
        };
    }

    /**
     * external parameters change
     */
    UNSAFE_componentWillReceiveProps(newProps) {

        if (newProps.config !== this.props.config) {
            this.setState(
                { config: newProps.config }
            )
        }

        if (newProps.meta !== this.props.meta) {
            this.setState(
                { meta: newProps.meta }
            )
        }

        if (newProps.allColOptions !== this.props.allColOptions) {
            this.setState(
                { allColOptions: newProps.allColOptions }
            )
        }
        if (newProps.numColOptions !== this.props.numColOptions) {
            this.setState(
                { numColOptions: newProps.numColOptions }
            )
        }
        if (newProps.catColOptions !== this.props.catColOptions) {
            this.setState(
                { catColOptions: newProps.catColOptions }
            )
        }
    }

    setStateConfig(input) {

        let cfg = this.config_from_state(input);
        this.setState({
            ...input,
            config: cfg
        });
        this.props.setProps(
            { config: cfg }
        );

    }

    config_from_state(input) {
        return {
            type: "base"
        }
    }

    static config_to_string(el) {
        return <span>{JSON.stringify(el)}</span>;
    }

    /**
     * use the config to compute a new transformed meta
     * @param {} input 
     * @returns 
     */
    static eval(input) {
        let current_meta = input["meta"];
        let new_meta = { ...current_meta };

        return {
            error: false,
            message: "",
            new_meta: new_meta
        }
    }

    static get_dummy_meta_entry(type, value) {
        if (type === "numerical") {
            return {
                max: value,
                median: value,
                min: value,
                type: "numerical"
            }
        }
        if (type === "bool") {
            return {
                type: "bool"
            }
        }
        if (type === "temporal") {
            return {
                max: String(value),
                median: String(value),
                min: String(value),
                type: "temporal"
            }
        }
        if (type === "categorical") {
            return {
                cat: [value],
                type: "categorical"
            }
        }
        return { type: type };
    }

    static get_col_or_median(el) {
        if ("cat" in el) {
            return el.cat[0];
        } else if ("median" in el) {
            return el.median;
        } else {
            return "true";
        }
    }


    render() {
        return false;
    }

}


SubComponentBase.defaultProps = {};

SubComponentBase.propTypes = {

    /**
    * The config the user sets in this component.
    */
    config: PropTypes.any,

    /**
     * The metadata this section is based on.
     */
    meta: PropTypes.any.isRequired,

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
