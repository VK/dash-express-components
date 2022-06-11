import React from 'react';
import Base from './_sub/Base.react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';


import Scatter from './_plot/Scatter.react';
import Box from './_plot/Box.react';
import Violin from './_plot/Violin.react';

import Imshow from './_plot/Imshow.react';

import Bar from './_plot/Bar.react';
import BarCount from './_plot/BarCount.react';
import ScatterMatrix from './_plot/ScatterMatrix.react';

import HistogramLine from './_plot/HistogramLine.react';
import Probability from './_plot/Probability.react';

import Table from './_plot/Table.react';
let known_plots = [Scatter, Box, Violin, Imshow, Bar, BarCount, ScatterMatrix, HistogramLine, Probability, Table].map(el => {
    return { type: el.type, class: el, label: el.label, icon: el.icon }
});
let plots_dict = Object.assign({}, ...known_plots.map((x) => ({ [x.type]: x })));


/**
 * <div style="width:450px; margin-left: 20px; float: right;  margin-top: -150px;">
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/plotter.png"/>
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/plotter-modal.png"/>
 * </div>
 * 
 * The `Plotter` component helps to define the right plot parameters in the style of plotly.express.
 * 
 * There are several different plot types, and some of them are given directly by plotly.express, like:
 * <ul style="margin-left: 20px;">
 *   <li>scatter</li>
 *   <li>box</li>
 *   <li>violin</li>
 *   <li>bar</li>
 *   <li>scatter_matrix</li>
 * </ul>
 * 
 * Others are computed more indirect, like:
 * <ul style="margin-left: 20px;">
 *   <li>imshow</li>
 *   <li>bar_count</li>
 *   <li>histogram_line</li>
 *   <li>probability</li>
 *   <li>table</li>
 * </ul>
 * 
 * @hideconstructor
 * 
 * @example
 * import dash_express_components as dxc
 * import plotly.express as px
 * 
 * meta = dxc.get_meta(px.data.gapminder())
 * 
 * dxc.Plotter(
 * ???
 * )
 * @public
 */
class Plotter extends Base {
    constructor(props) {
        super({}, props);

        this.state =
        {
            ...this.state,

            /* state of the modal to add new filters */
            showModal: false,
            plotType: (this.state.config && this.state.config.type) ? this.state.config.type : "scatter",

        };
    }

    handleClose() {
        this.setState({ showModal: false });
    }
    handleShow() {
        this.setState({ showModal: true });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        super.UNSAFE_componentWillReceiveProps(newProps);
        try {
            if (("config" in newProps) && ("type" in newProps.config)) {
                this.setState({
                    plotType:
                        newProps.config.type
                });
            }
        } catch { };




    }


    get_modal() {

        const {
            showModal,
            id
        } = this.state;

        return (<Modal
            size="xl"
            centered
            backdrop="static"
            animation={false}
            show={showModal}
            onHide={() => this.handleClose()}
            key={id + "-plot-type-modal"}
        >
            <Modal.Header closeButton>
                <Modal.Title>Plot Types</Modal.Title>
            </Modal.Header>
            <Modal.Body><div className="mt-2 container row" style={{ paddingRight: 0 }}>

                {known_plots.map(pt => {


                    return (
                        <div className="col-6 mb-2"><Button
                            key={"set-plot-" + pt.type}
                            variant="outline-secondary"
                            className="d-flex align-items-center w-100"

                            onClick={(e) => {

                                this.setState({
                                    plotType: pt.type
                                });
                                this.handleClose()
                            }}

                        >
                            <div style={{ width: "75px", height: "75px" }}>{(pt && "icon" in pt) ? pt.icon : ""}</div>
                            <div className="flex-grow-1 mt-2 h3">
                                {(pt && "label" in pt) ? pt.label : ""}
                            </div>
                        </Button></div>
                    );
                })}

            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleClose()}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>)
    }

    render() {
        const {
            plotType,
            config,
            allColOptions,
            catColOptions,
            numColOptions,
            allOptions
        } = this.state;

        const { id } = this.props;

        const pt = plots_dict[plotType];

        return (
            <div>

                <Button
                    key={id + "plot-open-button"}
                    variant="outline-secondary"
                    className="d-flex align-items-center w-100 mb-2"
                    onClick={() => this.handleShow()}>

                    {(pt && "icon" in pt) && <div style={{ width: "60px", height: "60px" }}>{pt.icon}</div>}
                    {(pt && "icon" in pt) && <div className="flex-grow-1 mt-2 h3">{pt.label}</div>}
                    {!(pt && "icon" in pt) && <div className="flex-grow-1 mt-2 h3" >Choose a plot type</div>}

                </Button>


                {
                    known_plots.map((plt, idx) => {

                        return (
                            plotType === plt["type"] &&
                            <plt.class
                                key={id + "plottype-" + plt["type"]}
                                id={id + "plottype-" + plt["type"]}
                                allColOptions={allColOptions}
                                catColOptions={catColOptions}
                                numColOptions={numColOptions}
                                allOptions={allOptions}
                                config={config}
                                setProps={e => {
                                    if ("config" in e) {
                                        super.update_config(e["config"]);
                                    }
                                }}
                            />
                        )
                    })
                }


                {this.get_modal()}

            </div>
        )

    }
}



Plotter.defaultProps = {};

/**
 * @typedef
 * @public
 * @enum {}
 */
Plotter.propTypes = {

    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string.isRequired,

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

/**
 * @private
 */
export default Plotter;