import React from 'react';
import Base from './sub/Base.react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



import PlotterBase from './plot/PlotterBase.react';
import Scatter from './plot/Scatter.react';
let known_plots = [PlotterBase, Scatter].map(el => {
    return {type: el.type, class: el, label: el.label, icon: el.icon}
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
            plotType: "base",

        };

    }

    handleClose() {
        this.setState({ showModal: false });
    }
    handleShow() {
        this.setState({ showModal: true });
    }


    get_modal() {

        const {
            showModal
        } = this.state;

        return (<Modal backdrop="static"
            show={showModal}
            onHide={() => this.handleClose()}
        >
            <Modal.Header closeButton>
                <Modal.Title>Plot Types</Modal.Title>
            </Modal.Header>
            <Modal.Body><div style={{ minHeight: "15em" }} className="mb-3">

                {known_plots.map(pt => {


                    return (
                        <Button
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
                            <div style={{ width: "60px", height: "60px" }}>{pt.icon}</div>
                            <div className="flex-grow-1 mt-2 h3">
                                {pt.label}
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
            allColOptions,
            catColOptions,
            numColOptions
        } = this.state;

        const pt = plots_dict[plotType];

        return (
            <Accordion.Item eventKey="plotter">
                <Accordion.Header>Plotter</Accordion.Header>
                <Accordion.Body>

                    <Button
                        key="plot-open-button"
                        variant="outline-secondary"
                        className="d-flex align-items-center w-100 mb-2"
                        onClick={() => this.handleShow()}>
                        <div style={{ width: "60px", height: "60px" }}>{pt.icon}</div>
                        <div className="flex-grow-1 mt-2 h3">
                            {pt.label}
                        </div>
                    </Button>


                    {
                        known_plots.map(plt => {

                            return (
                                plotType === plt["type"] &&
                                <plt.class
                                    key={"pltconfig-" + plt["type"]}
                                    allColOptions={allColOptions}
                                    catColOptions={catColOptions}
                                    numColOptions={numColOptions}
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

                </Accordion.Body>

            </Accordion.Item>
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
