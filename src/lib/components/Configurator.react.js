import { Component } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';


import Filter from './Filter.react';
import Transform from './Transform.react';
import MetaCheck from './MetaCheck.react';
import Plotter from './Plotter.react';
import Parametrize from './Parametrize.react';
import Localstore from './Localstore.react';
import { none } from 'ramda';


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
            id: this.props.id,
            config: {},
            meta: props.meta,
            filter_meta_out: { ...props.meta },
            transform_meta_out: { ...props.meta },

            /* state of the modal to ask if edit should be opened */
            showEditModal: false,
            eventConfig: {},
            eventThumbnail: "",
            eventGraphId: ""

        };

        this.state.config = this.fix_config(this.state.config);

        window.addEventListener("message", (event) => {

            if ("data" in event && "configuratorId" in event.data && event.data.configuratorId == this.props.id) {
                console.log(event);

                this.setState({
                    showEditModal: true,
                    eventConfig: this.fix_config(event.data.defs),
                    eventThumbnail: event.data.thumbnail,
                    eventGraphId: event.data.graphId
                });

            }

        }, false);

    }


    fix_config(new_config) {
        if (!("filter") in new_config) {
            new_config["filter"] = [];
        }
        if (!("transform") in new_config) {
            new_config["transform"] = [];
        }
        if (!("plot") in new_config) {
            new_config["plot"] = {};
        }
        if (!("parameterization") in new_config) {
            new_config["parameterization"] = {
                parameters: [],
                computeAll: false,
                computeMatrix: []
            };
        }
        return new_config;
    }


    update_config(new_config) {

        new_config = this.fix_config(new_config);
        this.setState(
            { config: new_config },
            () => {

                this.props.setProps({
                    config: new_config
                })
            });
    }


    /**
     * external parameters like the dataframe metadata might change.
     * Then we have to update the content
     */
    UNSAFE_componentWillReceiveProps(newProps) {

        if (newProps.config !== this.props.config) {
            this.setState(
                { config: this.fix_config(newProps.config) }
            )
        }

        if (newProps.meta !== this.props.meta) {
            this.setState(
                { meta: newProps.meta }
            )
        }
    }


    handleClose() {
        this.setState({ showEditModal: false });
    }


    render() {
        const { id } = this.props;
        const { meta, filter_meta_out, transform_meta_out, showEditModal } = this.state;
        let { config } = this.state;

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

                <CustomAccordionItem title="Parameterize" defaultOpen>
                    <Parametrize
                        key="parametrize"
                        meta={transform_meta_out}
                        config={{ ...config }}
                        setProps={out => {
                            if ("config" in out) {
                                let new_config = { ...out.config };
                                new_config = JSON.parse(JSON.stringify(new_config));
                                config = new_config;
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


                <Modal backdrop="static" show={showEditModal} onHide={() => this.handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Load Plot Config</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><div style={{ minHeight: "15em" }} className="mb-3">

                        Do you want the load the plot configuration for this plot:
                        <img src={this.state.eventThumbnail} alt="Plot Image" className='w-100' />

                        <b>Note!</b> It will replace the current plot configuration.
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) => {

                            this.update_config(
                                this.state.eventConfig
                            );
                            //perhaps we want to do something with the eventGraphId
                            //to update the plot just for the right id?

                            this.handleClose();
                        }}>
                            Load
                        </Button>
                    </Modal.Footer>
                </Modal>


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

