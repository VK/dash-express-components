import React from 'react';
import Base from './sub/Base.react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Accordion from 'react-bootstrap/Accordion';


import EvalTransform from './sub/EvalTransform.react';
import MeltTransform from './sub/MeltTransform.react';
import CombinecatTransform from './sub/CombinecatTransform.react';
let known_trafos = [
    { type: "eval", class: EvalTransform, "label": "Compute new column" },
    { type: "combinecat", class: CombinecatTransform, "label": "Combine to categorical column" },
    { type: "melt", class: MeltTransform, "label": "Melt multiple colums to one" }
]



export default class Transform extends Base {
    constructor(props) {
        super(props);



        this.state =
        {
            ...this.state,

            /* state of the modal to add new filters */
            showAddModal: false,

            transformType: "",
            sub_config: {}
        };

        this.update_config(this.state.config, true);
    }

    handleClose() {
        this.setState({ showAddModal: false });
    }
    handleShow() {
        this.setState({ showAddModal: true });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const update_config_needed = (newProps.config !== this.props.config);

        super.UNSAFE_componentWillReceiveProps(newProps);

        if (update_config_needed && "config" in newProps) {
            this.update_config(newProps.config);
        }

    }


    update_config(new_config, constructor = false) {
        super.update_config(new_config, constructor);

        //let new_meta = JSON.parse(JSON.stringify(this.state.meta))
        let new_meta = { ...this.state.meta };

        if (new_config)
            new_config.forEach(el => {

                let transform_class = known_trafos.filter(t => t["type"] === el["type"])[0]["class"];
                let res = transform_class.eval(
                    {
                        ...el,
                        meta: new_meta
                    }
                );
                if (res["new_meta"] != undefined) {
                    new_meta = res["new_meta"];
                }


            });

        super.update_meta_out(new_meta, constructor);

        if (constructor) {
            this.state = {
                ...this.state,
                ...this.get_columns(new_meta)
            }
        } else {
            this.setState(this.get_columns(new_meta));
        }
    }

    get_transform_blocks() {
        const { config } = this.state;

        if (config) {
            return <div>
                {
                    config.map((el, id) => {

                        let transform_class = known_trafos.filter(t => t["type"] === el["type"])[0]["class"];

                        let config_string = transform_class.config_to_string(el);

                        return (<Alert dismissible={id === config.length - 1} key={id} onClose={() => {

                            let new_config = config.filter((e, idx) => idx !== id);
                            this.update_config(new_config)

                        }}>{config_string}</Alert>)
                    }
                    )
                }

            </div>
        }
    }




    get_modal_blocks() {

        const {
            allColOptions,
            catColOptions,
            numColOptions,
            meta_out,


            showAddModal,
            transformType,

            sub_config,
            config,
        } = this.state;


        return (<Modal backdrop="static"
            show={showAddModal}
            onHide={() => this.handleClose()}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add transform</Modal.Title>
            </Modal.Header>
            <Modal.Body><div style={{ minHeight: "15em" }} className="mb-3">



                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
                    <Form.Select


                        value={transformType}
                        onChange={e => {
                            this.setState({
                                transformType: e.target.value,
                                new_transform: {}

                            });
                        }}

                    >
                        <option value=""></option>
                        {
                            known_trafos.map(trafo_el => {
                                return (<option key={"option" + trafo_el["type"]} value={trafo_el["type"]}>{trafo_el.label}</option>)
                            })
                        }
                    </Form.Select>

                </InputGroup>



                {
                    known_trafos.map(trafo_el => {
                        return (
                            transformType === trafo_el["type"] &&
                            <trafo_el.class
                                key={"config" + trafo_el["type"]}
                                meta={meta_out}
                                allColOptions={allColOptions}
                                catColOptions={catColOptions}
                                numColOptions={numColOptions}
                                setProps={e => { if ("config" in e) { this.setState({ sub_config: e.config }) } }}
                            />
                        )
                    })
                }


            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleClose()}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e) => {

                    if ("type" in sub_config) {


                        let transform_class = known_trafos.filter(el => el["type"] === sub_config["type"])[0]["class"];
                        let res = transform_class.eval(
                            {
                                ...sub_config,
                                meta: meta_out
                            }
                        );

                        if (!res.error || window.confirm("Do you want to add the transform, even with errors?")) {
                            let new_config = [
                                ...config,
                                sub_config
                            ];

                            this.update_config(new_config);
                            this.handleClose();
                        }


                    }


                }}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>)

    }

    render() {

        return (
            <div>
                {this.get_transform_blocks()}

                <Button className='w-100' onClick={() => this.handleShow()}>
                    Add transformation
                </Button>

                {this.get_modal_blocks()}
            </div>
        )

    }
}



Transform.defaultProps = {};


Transform.propTypes = {

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
