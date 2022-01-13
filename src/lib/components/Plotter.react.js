import React from 'react';
import Base from './sub/Base.react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



import Scatter from './plot/Scatter.react';
import Box from './plot/Box.react';
import Violin from './plot/Violin.react';

import Imshow from './plot/Imshow.react';

import BarCount from './plot/BarCount.react';
import ScatterMatrix from './plot/ScatterMatrix.react';

import HistogramLine from './plot/HistogramLine.react';
import Probability from './plot/Probability.react';

import Table from './plot/Table.react';
let known_plots = [Scatter, Box, Violin, Imshow, BarCount, ScatterMatrix, HistogramLine, Probability, Table].map(el => {
    return { type: el.type, class: el, label: el.label, icon: el.icon }
});
let plots_dict = Object.assign({}, ...known_plots.map((x) => ({ [x.type]: x })));



export default class Plotter extends Base {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,

            /* state of the modal to add new filters */
            showModal: false,
            plotType: (this.state.config && this.state.config.type) ? this.state.config.type : "base",

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
            showModal
        } = this.state;

        return (<Modal backdrop="static"
            show={showModal}
            onHide={() => this.handleClose()}
            key="plot-type-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Plot Types</Modal.Title>
            </Modal.Header>
            <Modal.Body><div className="mt-2">

                {known_plots.map(pt => {


                    return (
                        <Button
                            key={"set-plot-" + pt.type}
                            variant="outline-secondary"
                            className="d-flex align-items-center w-100 mb-2"

                            onClick={(e) => {

                                this.setState({
                                    plotType: pt.type
                                });
                                this.handleClose()
                            }}

                        >
                            <div style={{ width: "60px", height: "60px" }}>{(pt && "icon" in pt) ? pt.icon : ""}</div>
                            <div className="flex-grow-1 mt-2 h3">
                                {(pt && "label" in pt) ? pt.label : ""}
                            </div>
                        </Button>
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
            numColOptions
        } = this.state;

        const pt = plots_dict[plotType];

        return (
            <div>

                <Button
                    key="plot-open-button"
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
                                key={"plottype-" + idx}
                                allColOptions={allColOptions}
                                catColOptions={catColOptions}
                                numColOptions={numColOptions}
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


Plotter.propTypes = {

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
