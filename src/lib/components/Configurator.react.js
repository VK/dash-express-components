import { Component } from 'react';

import Accordion from 'react-bootstrap/Accordion';

import Filter from './Filter.react';


/**
 * Configurator component
 */
export default class Configurator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            config: props.config,
            meta: props.meta,
            filter_meta_out: null
        };

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
        }
    }


    render() {
        const { id } = this.props;
        const { meta, config } = this.state;


        return (

            <Accordion id={id}>


                < Filter
                    meta={meta}
                    config={config.filter}
                    setProps={
                        out => {
                            if ("config" in out) {
                                let new_config = { ...config };
                                new_config["filter"] = out.config;
                                this.update_config(new_config);
                            }

                            if("meta_out" in out) {
                                this.setState({filter_meta_out: out.meta_out});
                            }
                        }}
                />


            </Accordion >



        );
    }
}

Configurator.defaultProps = {};

Configurator.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,


    /**
     * The metadata the plotter selection is based on.
     */
    meta: PropTypes.any.isRequired,

    /**
     * Prop The resulting configuration of the plot.
     */
    config: PropTypes.any,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
}
