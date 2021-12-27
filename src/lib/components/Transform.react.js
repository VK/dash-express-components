import { filter, isNil, pluck } from 'ramda';
import React from 'react';
import Base from './Base.react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';



import VirtualizedSelect from 'react-virtualized-select';
import Accordion from 'react-bootstrap/Accordion';
import DateTimePicker from 'react-datetime-picker';


import { compileCode } from '@nx-js/compiler-util';



function get_dummy_meta_entry(type, value) {
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


function get_col_or_median(el) {
    if ("cat" in el) {
        return el.cat[0];
    } else if ("median" in el) {
        return el.median;
    } else {
        return "true";
    }
}


export default class Transform extends Base {
    constructor(props) {
        super(props);



        this.state =
        {
            ...this.state,

            /* state of the modal to add new filters */
            showAddModal: false,


            transformType: "",
            newColName: "",
            newColNameTwo: "",
            newColFormula: "",

            newColComputeResult: null,

            new_transform: {},
            selectedCols: [],
            selectedColsTwo: [],


        };

    }

    handleClose() {
        this.setState({ showAddModal: false });
    }
    handleShow() {
        this.setState({ showAddModal: true });
    }


    update_config(new_config) {
        super.update_config(new_config);

        let new_meta = JSON.parse(JSON.stringify(this.state.meta))

        new_config.forEach(el => {


            let res = this.compute_router(
                el, new_meta
            );

            new_meta = res["new_meta"];

        });

        console.log(new_meta);
        super.update_meta_out(new_meta);
        this.setState(this.get_columns(new_meta));
    }

    transform_to_string(el) {
        if (el["type"] == "eval") {
            return <span><b>{el.col}</b> = {el.formula}</span>
        }

        if (el["type"] == "combinecat") {
            return <span><b>{el.col}</b> combines [{el.cols.join(", ")}]</span>
        }

        if (el["type"] == "melt") {
            return <span><b>{el.col}</b> and <b>{el.col2}</b> melted from [{el.cols.join(", ")}]</span>
        }

        return <span>{JSON.stringify(el)}</span>;
    }

    get_transform_blocks() {
        const { config } = this.state;

        if (config) {
            return <div>
                {
                    config.map((el, id) =>

                        <Alert dismissible={id === config.length - 1} key={id} onClose={() => {

                            let new_config = config.filter((e, idx) => idx !== id);
                            this.update_config(new_config)

                        }}>{this.transform_to_string(el)}</Alert>
                    )
                }

            </div>
        }
    }



    compute_router(step_definition, current_meta) {
        return {
            eval: this.eval_compute,
            combinecat: this.eval_combinecat,
            melt: this.eval_melt
        }[step_definition["type"]](
            {
                ...step_definition,
                meta: current_meta
            });
    }



    eval_combinecat(input) {
        let current_meta;
        if ("meta" in input) {
            current_meta = input["meta"];
        } else {
            current_meta = { ...this.state.meta_out };
        }
        let col = input["col"];
        let cols = input["cols"];

        let res = cols.map(k => get_col_or_median(current_meta[k])).join("_");

        let output = {
            value: res, error: false, message: "", type: "categorical"
        };

        let new_meta = { ...current_meta };
        new_meta[col] = get_dummy_meta_entry("categorical", res);
        output["new_meta"] = new_meta;


        return output;

    }


    eval_melt(input) {
        let current_meta;
        if ("meta" in input) {
            current_meta = input["meta"];
        } else {
            current_meta = { ...this.state.meta_out };
        }
        let col = input["col"];
        let col2 = input["col2"];
        let cols = input["cols"];

        let res = cols.map(k => get_col_or_median(current_meta[k])).join("_");

        let output = {
            value: res, error: false, message: "", type: "categorical"
        };

        let new_meta = { ...current_meta };

        let var_col = get_dummy_meta_entry("categorical", res);
        var_col.cat = cols;
        let val_col = new_meta[cols[0]];

        cols.forEach(el => {
            delete new_meta[el];
        });
        new_meta[col2] = var_col;
        new_meta[col] = val_col;

        output["new_meta"] = new_meta;

        return output;

    }

    eval_compute(input) {

        let current_meta;
        if ("meta" in input) {
            current_meta = input["meta"];
        } else {
            current_meta = { ...this.state.meta_out };
        }



        let formula = input["formula"]
        let col = input["col"]


        let res = undefined;
        let error = false;
        let message = null;
        let type = undefined;
        try {

            let variables = {
                "at_pi": 3.14159265359,
                "at_e": 2.71828182846,
                "at_hbar": 6.58211951e-16,
                "at_c": 2.99792458e17,
                "at_hbar_c": 197.326979,
                sin: Math.sin,
                cos: Math.cos,
                tan: Math.tan,
                arcsin: Math.asin,
                arccos: Math.acos,
                arctan: Math.atan,
                arctan2: Math.atan2,

                sinh: Math.sinh,
                cosh: Math.cosh,
                tanh: Math.tanh,

                arcsinh: Math.asinh,
                arccosh: Math.acosh,
                arctanh: Math.atanh,



                exp: Math.exp,
                log: Math.log,
                log10: Math.log10,
                log1p: Math.log1p,
                expm1: Math.expm1,

                sqrt: Math.sqrt,

                ...Object.keys(current_meta).reduce(function (result, key) {
                    if (current_meta[key]["type"] === "numerical") {
                        result[key] = current_meta[key].median;
                    }
                    if (current_meta[key]["type"] === "bool") {
                        result[key] = true;
                    }
                    if (current_meta[key]["type"] === "categorical") {
                        result[key] = current_meta[key].cat[0];
                    }
                    if (current_meta[key]["type"] === "temporal") {
                        result[key] = new Date(current_meta[key].median);
                    }
                    return result
                }, {})
            };


            const code = compileCode('return ' + formula.replace("\@", "at_"));
            res = code(variables);

        }
        catch (e) {
            error = true;
            message = e.message;
        }

        if (!error) {


            if (String(res).indexOf(":") >= 0) {
                try {
                    let test_time = new Date(res);
                    if (test_time.getTime() === test_time.getTime()) { type = "temporal"; }
                } catch (e) {
                }
            }

            if (type !== "temporal") {
                type = {
                    number: "numerical",
                    boolean: "bool",
                    string: "categorical",
                    undefined: "?"
                }[String(typeof res)];
            }
        }

        if (type === "?") {
            error = true;
        }

        if (type === "numerical" && isNaN(res)) {
            error = true;
        }

        let output = {
            value: res, error: error, message: message, type: type
        };

        if (!error) {
            let new_meta = { ...current_meta };
            new_meta[col] = get_dummy_meta_entry(type, res);
            output["new_meta"] = new_meta;
        }

        return output;
    }

    get_modal_blocks() {

        const {
            allColOptions,
            selectedCols,
            selectedColsTwo,

            showAddModal,
            transformType,

            newColName,
            newColNameTwo,
            newColComputeResult,
            newColFormula,
            new_transform,

            config, meta } = this.state;


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
                        <option value="eval">eval</option>
                        <option value="combinecat">combine categories</option>
                        <option value="melt">melt</option>
                    </Form.Select>

                </InputGroup>


                {
                    transformType === "eval" && <div>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                            <FormControl value={newColName} onChange={e => {
                                this.setState({ newColName: e.target.value });
                            }} />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Formula</InputGroup.Text>
                            <FormControl as="textarea" rows={3} value={newColFormula} onChange={e => {

                                let dummy = {
                                    "type": "eval",
                                    "col": newColName,
                                    "formula": e.target.value,
                                }

                                this.setState({
                                    newColFormula: e.target.value,
                                    new_transform: dummy,
                                    newColComputeResult: this.eval_compute(dummy)
                                })
                            }}
                            />
                        </InputGroup>

                        {newColComputeResult && "error" in newColComputeResult && newColComputeResult.error && <Alert>{newColComputeResult.message}</Alert>}
                        {newColComputeResult && "error" in newColComputeResult && !newColComputeResult.error &&
                            <Alert variant="success">New col: {newColName} ({newColComputeResult.type}) e.q. {newColComputeResult.value}</Alert>}
                    </div>
                }


                {
                    transformType === "combinecat" && <div>
                        Select the name of a new category.
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                            <FormControl value={newColName} onChange={e => {
                                this.setState({ newColName: e.target.value });
                            }} />
                        </InputGroup>

                        Select the columns that should be grouped into a new cateogy.


                        <VirtualizedSelect
                            className="mb-3"
                            multi

                            options={allColOptions}

                            value={selectedCols}
                            onChange={selectedOption => {
                                let value;
                                if (isNil(selectedOption)) {
                                    value = [];
                                } else {
                                    value = pluck('value', selectedOption);
                                }
                                let dummy = {
                                    "type": "combinecat",
                                    "col": newColName,
                                    "cols": value,
                                }

                                this.setState({
                                    selectedCols: value,
                                    new_transform: dummy
                                });
                            }}


                        />

                    </div>
                }





                {
                    transformType === "melt" && <div>
                        Select the name of a new columns.
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Type:</InputGroup.Text>
                            <FormControl value={newColNameTwo} onChange={e => {
                                this.setState({ newColNameTwo: e.target.value });
                            }} />

                            <InputGroup.Text id="basic-addon1">Value:</InputGroup.Text>
                            <FormControl value={newColName} onChange={e => {
                                this.setState({ newColName: e.target.value });
                            }} />
                        </InputGroup>

                        Select the columns that should be combined:

                        <VirtualizedSelect
                            className="mb-3"
                            multi

                            options={allColOptions}

                            value={selectedCols}
                            onChange={selectedOption => {
                                let value;
                                if (isNil(selectedOption)) {
                                    value = [];
                                } else {
                                    value = pluck('value', selectedOption);
                                }

                                let dummy = {
                                    "type": "melt",
                                    "col": newColName,
                                    "col2": newColNameTwo,
                                    "cols": value,
                                }

                                this.setState({
                                    selectedCols: value,
                                    new_transform: dummy
                                });
                            }}


                        />

                    </div>
                }




            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleClose()}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e) => {

                    if ("type" in new_transform) {


                        if ("col" in new_transform) {
                            new_transform["col"] = newColName;
                        }
                        if ("col2" in new_transform) {
                            new_transform["col2"] = newColNameTwo;
                        }

                        let new_config = [
                            ...config,
                            new_transform
                        ];

                        this.update_config(new_config);

                        this.handleClose();
                    }


                }}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>)

    }

    render() {

        return (
            <Accordion.Item eventKey="transform">
                <Accordion.Header>Transform</Accordion.Header>
                <Accordion.Body>
                    {this.get_transform_blocks()}

                    <Button className='w-100' onClick={() => this.handleShow()}>
                        Add transformation
                    </Button>

                    {this.get_modal_blocks()}
                </Accordion.Body>

            </Accordion.Item>
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
