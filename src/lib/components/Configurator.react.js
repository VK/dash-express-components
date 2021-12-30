import { Component } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import classNames from 'classnames';


import Filter from './Filter.react';
import Transform from './Transform.react';
import MetaCheck from './MetaCheck.react';
import Plotter from './Plotter.react';
import Parametrize from './Parametrize.react';
import Localstore from './Localstore.react';


class CustomAccordionItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: ("defaultOpen" in props)
        }
    }

    render() {
        const { isOpen } = this.state;

        return (
            <div className='accordion-item'>
                <h2 className='accordion-header'>
                    <button
                        type="button"
                        className={classNames('accordion-button', !isOpen && 'collapsed')}
                        onClick={e => { this.setState({ isOpen: !isOpen }); }}
                    >
                        {this.props.title}
                    </button>
                </h2>
                <div className={classNames('accordion-collapse', !isOpen && 'collapse')}>
                    <div className='accordion-body'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}


/**
 * Configurator component
 */
export default class Configurator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            config: props.config,
            meta: props.meta,
            filter_meta_out: { ...props.meta },
            transform_meta_out: { ...props.meta }
        };

    }

    update_config(new_config) {

        console.log("update_config");
        console.log(new_config);
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
        const { meta, config, filter_meta_out, transform_meta_out } = this.state;


        return (

            <Accordion id={id} defaultActiveKey="plotter">


                <CustomAccordionItem title="Filter">
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

                                if ("meta_out" in out) {
                                    this.setState({ filter_meta_out: out.meta_out });
                                }
                            }}
                    />
                </CustomAccordionItem>


                <CustomAccordionItem title="Transform">
                    <Transform
                        key="transform"
                        meta={filter_meta_out}
                        config={config.transform}
                        setProps={
                            out => {
                                if ("config" in out) {
                                    let new_config = { ...config };
                                    new_config["transform"] = out.config;
                                    this.update_config(new_config);
                                }

                                if ("meta_out" in out) {
                                    this.setState({ transform_meta_out: out.meta_out });
                                }
                            }}
                    />
                </CustomAccordionItem>





                <CustomAccordionItem title="Plotter" defaultOpen>
                    <Plotter
                        key="plotter"
                        meta={transform_meta_out}
                        config={config.plot}
                        setProps={
                            out => {
                                if ("config" in out) {
                                    let new_config = { ...config };
                                    new_config["plot"] = out.config;
                                    this.update_config(new_config);
                                }
                            }}
                    />
                </CustomAccordionItem>

                <CustomAccordionItem title="Data Columns">
                    <MetaCheck
                        key="metacheck"
                        meta={transform_meta_out}
                        setProps={out => { }}
                    />
                </CustomAccordionItem>

                <CustomAccordionItem title="Parametrize">
                    <Parametrize
                        key="parametrize"
                        meta={transform_meta_out}
                        config={config}
                        setProps={out => {
                            if ("config" in out) {
                                let new_config = { ...out.config }
                                this.update_config(new_config);
                            }
                        }}
                    />
                </CustomAccordionItem>

                <CustomAccordionItem title="Store">
                    <Localstore
                        key="store"
                        meta={transform_meta_out}
                        config={config}
                        setProps={out => {
                            if ("config" in out) {
                                let new_config = { ...out.config }
                                this.update_config(new_config);
                            }
                        }}
                    />
                </CustomAccordionItem>

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

