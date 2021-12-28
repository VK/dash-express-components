import { Component } from 'react';


export default class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            meta: props.meta,
            meta_out: props.meta,
            ...this.get_columns(props.meta)
        };
    }


    update_meta_out(new_meta_out) {
        this.setState({
            meta_out: new_meta_out
        });
        this.props.setProps({
            meta_out: new_meta_out
        });
    }

    update_config(new_config) {
        this.setState({
            config: new_config
        });
        this.props.setProps({
            config: new_config
        });
    }

    /**
     * A helper to compute the column dropdown options based on the column metadata
     * We also filter continous and categorical variables, since some options only
     * work with one of them.
     * @param meta 
     * @returns 
     */
    get_columns(meta) {

        const numCols = Object.keys(meta)
            .filter((key) => {
                return meta[key].type === "numerical" || meta[key].type === "temporal";
            })
            .reduce((obj, key) => {
                obj[key] = meta[key];
                return obj;
            }, {});

        const catCols = Object.keys(meta)
            .filter((key) => {
                return meta[key].type === "categorical" | meta[key].type === "bool";
            })
            .reduce((obj, key) => {
                obj[key] = meta[key];
                return obj;
            }, {});

        return {
            numCols: numCols,
            catCols: catCols,

            allColOptions: Object.keys(meta).map(option => ({
                label: String(option),
                value: option,
            })),
            numColOptions: Object.keys(numCols).map(option => ({
                label: String(option),
                value: option,
            })),
            catColOptions: Object.keys(catCols).map(option => ({
                label: String(option),
                value: option,
            })),


        }
    }

    /**
     * external parameters like the dataframe metadata might change.
     * Then we have to update the content
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
            this.setState(
                this.get_columns(newProps.meta)
            )
        }

        if (newProps.meta_out !== this.props.meta_out) {
            this.setState(
                { meta_out: newProps.meta_out }
            )
        }

    }

    render() {
        return false;
    }
}


Base.defaultProps = {};

Base.propTypes = {

    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
    * The config the user sets in this component.
    */
    config: PropTypes.any,

    /**
     * The metadata this section is based on.
     */
    meta: PropTypes.any.isRequired,


    /**
     * The metadata section will create as output.
     */
    meta_out: PropTypes.any,


    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};
