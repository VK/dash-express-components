import { Component } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import classNames from 'classnames';


import Filter from './Filter.react';
import Transform from './Transform.react';
import MetaCheck from './MetaCheck.react';
import Plotter from './Plotter.react';
import Parameterize from './Parameterize.react';
import Localstore from './Localstore.react';
import { none } from 'ramda';



/**
 * Warp all subcomponents used in the configurator into an accordion
 * 
 * @private
 */
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
 * The configurator component helps to define plot definitions based on the
 * metadata of a dataframe.
 * 
 * The metadata is used to compute the available parameters after data 
 * transformations for the most common plot types.
 * @hideconstructor
 * 
 * @example
 * import dash_express_components as dxc
 * import plotly.express as px
 * 
 * meta = dxc.get_meta(px.data.gapminder())
 * 
 *  dxc.Configurator(
 *           id="plotConfig",
 *           meta=meta,
 *  )
 * @public
 */
class Configurator extends Component {
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
            eventGraphId: "",
            modal_close_timeout: undefined

        };

        this.state.config = this.fix_config(this.state.config);

        this.state.config_filter = this.state.config.filter;
        this.state.config_transform = this.state.config.transform;
        this.state.config_plot = this.state.config.plot;

        window.addEventListener("message", (event) => {

            if ("data" in event && "configuratorId" in event.data && event.data.configuratorId == this.props.id) {

                this.setState({
                    showEditModal: true,
                    eventConfig: this.fix_config(event.data.defs),
                    eventThumbnail: event.data.thumbnail,
                    eventGraphId: event.data.graphId
                });

                let that = this;
                let modal_close_timeout = setTimeout(function () { that.handleClose(); }, 5000);

                this.setState({ modal_close_timeout: modal_close_timeout });

            }

        }, false);

    }


    fix_config(new_config) {
        if (new_config == undefined) {
            new_config = {};
        }
        if (!("filter" in new_config)) {
            new_config["filter"] = [];
        }
        if (!("transform" in new_config)) {
            new_config["transform"] = [];
        }
        if (!("plot" in new_config)) {
            new_config["plot"] = {};
        }
        if (!("parameterization" in new_config)) {
            new_config["parameterization"] = {
                parameters: [],
                computeAll: false,
                computeMatrix: []
            };
        }
        return new_config;
    }

    update_sub_config(config_dict) {

        let that = this;

        setTimeout(function () {

            let new_config = { ...that.state.config, ...config_dict };

            ["filter", "transform", "plot"].forEach(el => {
                if (el in config_dict) {
                    that.setState({ ['config_' + el]: config_dict[el] },
                        () => { that.update_config(new_config); }
                    )
                }
            })
        }, 50);
    }


    update_config(new_config) {


        new_config = this.fix_config(new_config);

        this.setState({ config_filter: new_config.filter },
            () => {
                this.setState({ config_transform: new_config.transform },
                    () => {
                        this.setState({ config_plot: new_config.plot },
                            () => {
                                this.setState({ config: new_config });
                            })
                    }
                )
            });

    }

    update_props(graphId = null) {
        let config = JSON.parse(JSON.stringify(this.state.config));

        config["graphId"] = graphId;

        if (config.filter == null || config.filter === undefined || config.filter.length === 0) {
            delete config["filter"];
        }

        if (config.transform == null || config.transform === undefined || config.transform.length === 0) {
            delete config["transform"];
        }

        if (config.parameterization == null || config.parameterization === undefined || config.parameterization.parameters === undefined
            || config.parameterization.parameters.length === 0) {
            delete config["parameterization"];
        }

        if (config.graphId === null || config.graphId === undefined) {
            delete config["graphId"];
        }

        this.props.setProps({
            config: JSON.parse(JSON.stringify(config))
        });
    }


    /**
     * external parameters like the dataframe metadata might change.
     * Then we have to update the content
     * @private
     */
    UNSAFE_componentWillReceiveProps(newProps) {

        if (newProps.config !== this.props.config) {
            let config = this.fix_config(JSON.parse(JSON.stringify(newProps.config)));
            //let config = JSON.parse(JSON.stringify(this.fix_config(newProps.config)));
            this.setState(
                { config: config }
            )
        }

        if (newProps.meta !== this.props.meta) {
            this.setState(
                { meta: newProps.meta }
            )
        }



    }


    handleClose() {

        if (this.state.modal_close_timeout != undefined) {
            clearTimeout(this.state.modal_close_timeout);
        }
        this.setState({ showEditModal: false, modal_close_timeout: undefined });

    }


    render() {
        const { id } = this.props;
        const { meta, filter_meta_out, transform_meta_out, showEditModal, eventGraphId } = this.state;
        let { config,
            config_filter,
            config_transform,
            config_plot
        } = this.state;

        return (

            <Accordion id={id} key={id} defaultActiveKey="plotter">

                {this.props.showFilter && <CustomAccordionItem title="Filter">
                    < Filter
                        id={`${id}-filter`}
                        key={`${id}-filter`}
                        meta={meta}
                        config={config_filter}
                        setProps={
                            out => {
                                if ("config" in out) {
                                    //let new_config = { ...config };
                                    //new_config["filter"] = out.config;
                                    this.update_sub_config({ filter: out.config });
                                }

                                if ("meta_out" in out) {
                                    this.setState({ filter_meta_out: out.meta_out });
                                }
                            }}
                    />
                </CustomAccordionItem>}


                {this.props.showTransform && <CustomAccordionItem title="Transform">
                    <Transform
                        id={`${id}-transform`}
                        key={`${id}-transform`}
                        meta={filter_meta_out}
                        config={config_transform}
                        setProps={
                            out => {
                                if ("config" in out) {
                                    //let new_config = { ...config };
                                    //new_config["transform"] = out.config;
                                    this.update_sub_config({ transform: out.config });
                                }

                                if ("meta_out" in out) {
                                    this.setState({ transform_meta_out: out.meta_out });
                                }
                            }}
                    />
                </CustomAccordionItem>}

                {this.props.showMetadata && <CustomAccordionItem title="Data Columns">
                    <MetaCheck
                        id={`${id}-metacheck`}
                        key={`${id}-metacheck`}
                        meta={transform_meta_out}
                        setProps={out => { }}
                    />
                </CustomAccordionItem>}

                {this.props.showPlotter && <CustomAccordionItem title="Plotter" defaultOpen>
                    <Plotter
                        id={`${id}-plotter`}
                        key={`${id}-plotter`}
                        meta={transform_meta_out}
                        config={config_plot}
                        setProps={
                            out => {
                                if ("config" in out) {
                                    //let new_config = { ...config };
                                    //new_config["plot"] = out.config;
                                    this.update_sub_config({ plot: out.config });
                                }
                            }}
                    />
                </CustomAccordionItem>}


                {this.props.showUpdate && <div className='accordion-item' key={`${id}-save-btn`}>
                    <h2 className='accordion-header'>
                        <ButtonGroup className='w-100 p-3'>
                            <Button
                                onClick={e => { this.update_props(); }}
                                size="lg"
                                variant="outline-primary"
                            >New Plot</Button>
                            {/* enable update plot button only if available */}
                            {eventGraphId !== "" && false && <Button
                                onClick={e => { this.update_props(eventGraphId); }}
                                size="lg"
                                variant="outline-primary"
                            >Update Plot</Button>}
                        </ButtonGroup>
                    </h2>
                </div>}

                {this.props.showParameterization && <CustomAccordionItem title="Parameterize" defaultOpen>
                    <Parameterize
                        id={`${id}-parametrize`}
                        key={`${id}-parametrize`}
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
                </CustomAccordionItem>}

                {this.props.showStore && <CustomAccordionItem title="Store">
                    <Localstore
                        id={`${id}-store`}
                        key={`${id}-store`}
                        meta={transform_meta_out}
                        config={config}
                        setProps={out => {
                            if ("config" in out) {
                                let new_config = { ...out.config }
                                this.update_config(new_config);
                            }
                        }}
                    />
                </CustomAccordionItem>}


                <Modal
                    backdrop="static"
                    animation={false}
                    show={showEditModal}
                    onHide={() => this.handleClose()}>
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

Configurator.defaultProps = {
    showFilter: true,
    showTransform: true,
    showPlotter: true,
    showMetadata: false,
    showParameterization: false,
    showStore: false,
    showUpdate: true
};

/**
 * @typedef
 * @public
 * @enum {}
 */
Configurator.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     * @type {string}
     */
    id: PropTypes.string.isRequired,


    /**
     * The metadata the plotter selection is based on.
     * @type {Object}
     */
    meta: PropTypes.any.isRequired,

    /**
     * Prop The resulting configuration of the plot.
     * @type {Object}
     */
    config: PropTypes.any,

    /**
     * Prop to define the visibility of the Filter panel
     * @type {boolean}
     */
    showFilter: PropTypes.bool,

    /**
     * Prop to define the visibility of the Transform panel
     * @type {boolean}
     */
    showTransform: PropTypes.bool,

    /**
     * Prop to define the visibility of the Plot panel
     * @type {boolean}
     */
    showPlotter: PropTypes.bool,

    /**
     * Prop to define the visibility of the Metadata panel
     * @type {boolean}
     */
    showMetadata: PropTypes.bool,

    /**
     * Prop to define the visibility of the Parameterization panel
     * @type {boolean}
     */
    showParameterization: PropTypes.bool,

    /**
     * Prop to define the visibility of the Store panel
     * @type {boolean}
     */
    showStore: PropTypes.bool,

    /**
     * Prop to define the visibility of the update plot button
     * @type {boolean}
     */
    showUpdate: PropTypes.bool,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     * @private
     */
    setProps: PropTypes.func



}


/**
 * @private
 */
export default Configurator;
