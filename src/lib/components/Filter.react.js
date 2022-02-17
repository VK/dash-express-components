import { filter, isNil, pluck } from 'ramda';
import React from 'react';
import Base, { singleColorStyle, hideGroupComponents, multiCallbacks } from './_sub/Base.react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';



import Select from 'react-select';
import Accordion from 'react-bootstrap/Accordion';
import DateTimePicker from 'react-datetime-picker';

export default class Filter extends Base {
    constructor(props) {
        super([], props);



        this.state =
        {
            ...this.state,

            /* state of the modal to add new filters */
            showAddModal: false,

            /* content of the dropdown to select coolum names*/
            selectedColumn: null,
            selectedType: null,

            /* conent of the dropdown to select a label if a cat column is selected*/
            categoryOptions: [],
            selectedCategories: [],

            selectedDateTime: new Date(),

            filterType: "",
            filterNumber: 0,

            filterIndex: undefined,

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

        let new_meta = JSON.parse(JSON.stringify(this.props.meta))
        //let new_meta = { ...this.props.meta };

        if (new_config)
            new_config.forEach(el => {
                if (el.col in new_meta) {
                    if (el["type"] === "gt" || el["type"] === "gte") {

                        new_meta[el.col].min = el.value;
                        new_meta[el.col].max = Math.max(new_meta[el.col].max, el.value);
                        new_meta[el.col].median = Math.max(new_meta[el.col].median, el.value);
                    }
                    if (el["type"] === "lt" || el["type"] === "lte") {
                        new_meta[el.col].max = el.value;
                        new_meta[el.col].min = Math.max(new_meta[el.col].min, el.value);
                        new_meta[el.col].median = Math.max(new_meta[el.col].median, el.value);
                    }
                    if (el["type"] === "eq") {
                        new_meta[el.col].max = el.value;
                        new_meta[el.col].min = el.value;
                        new_meta[el.col].median = el.value;
                    }
                    if (el["type"] === "isin") {
                        new_meta[el.col].cat = new_meta[el.col].cat.filter(
                            ael => el.value.indexOf(ael) !== -1
                        )
                    }
                    if (el["type"] === "isnotin") {
                        new_meta[el.col].cat = new_meta[el.col].cat.filter(
                            ael => el.value.indexOf(ael) === -1
                        )
                    }
                }
            });


        super.update_meta_out(new_meta);
    }

    filter_to_string(el) {

        let translate = {
            isin: "∈",
            isnotin: "∉",
            gt: ">",
            gte: "≥",
            lt: "<",
            lte: "≤",
            eq: "=",
            neq: "≠",
            istrue: "= True",
            isfalse: "= False",

            after: "after",
            before: "before",
            lastn: "last days: ",

        }

        try {
            if (el["type"] === "isin" || el["type"] === "isnotin") {
                return <span><b>{el.col}</b> {translate[el["type"]]} [{el.value.join(', ')}]</span>;
            }
        } catch { }


        return <span><b>{el.col}</b> {translate[el["type"]]} {el.value}</span>;

    }

    get_filter_blocks() {
        const { config } = this.state;
        const { meta } = this.props;

        if (config) {
            return <div>
                {
                    config.map((el, id) =>
                        <Alert dismissible key={id} onClose={() => {

                            let new_config = config.filter((e, idx) => idx !== id);
                            this.update_config(new_config)

                        }}>{this.filter_to_string(el)}

                            <button className='btn-close btn-edit'

                                onClick={() => {

                                    let update_state = {
                                        filterIndex: id,
                                        selectedColumn: config[id].col,
                                        selectedType: meta[config[id].col].type,
                                        filterType: config[id].type,
                                        filterNumber: config[id].value
                                    }

                                    if (meta[config[id].col].type === "categorical") {

                                        update_state["selectedCategories"] = config[id].value;

                                        update_state["categoryOptions"] = [
                                            ...meta[config[id].col].cat.map(option => ({
                                                label: String(option),
                                                value: option,
                                            }))];
                                    }

                                    this.setState(update_state, () => {
                                        this.handleShow();
                                    })

                                }}
                            ></button>

                        </Alert>
                    )
                }

            </div>
        }
    }

    get_modal_blocks() {

        const {
            allColOptions,
            allOptions,
            showAddModal,
            selectedColumn, selectedType,
            categoryOptions, selectedCategories,
            selectedDateTime,
            filterType,
            filterNumber,
            filterIndex,
            config } = this.state;
        const { meta, id } = this.props;

        return (<Modal
            backdrop="static"
            animation={false}
            show={showAddModal}
            onHide={() => this.handleClose()}
        >
            <Modal.Header closeButton>
                <Modal.Title>{(filterIndex === undefined) ? "Add" : "Edit"} filter</Modal.Title>
            </Modal.Header>
            <Modal.Body><div style={{ minHeight: "15em" }} className="mb-3">

                Specify the column you want to filter.

                <Select
                    className="mb-3"
                    key={id + "-selectOptions"}

                    options={allColOptions}

                    value={allOptions.filter(o => o.value === selectedColumn)[0]}
                    onChange={selectedOption => {

                        let value = selectedOption.value;
                        let type = meta[value].type;


                        if (type == "categorical") {
                            this.setState({
                                categoryOptions: meta[value].cat.map(option => ({
                                    label: String(option),
                                    value: option,
                                }))
                            })
                        }

                        this.setState({
                            selectedColumn: value,
                            selectedType: type
                        });

                    }}
                    styles={singleColorStyle}
                    components={hideGroupComponents}
                />

                {
                    selectedType == "numerical" &&
                    <div>

                        Select the numerical filtering you want to apply:


                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
                            <Form.Select
                                key={id + "-selectType"}


                                value={filterType}
                                onChange={e => { this.setState({ filterType: e.target.value }); }}

                            >
                                <option value=""></option>
                                <option value="gt">&gt;</option>
                                <option value="gte">≥</option>
                                <option value="lt">&lt;</option>
                                <option value="lte">≤</option>
                                <option value="eq">=</option>
                                <option value="neq">≠</option>
                            </Form.Select>

                        </InputGroup>


                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Value</InputGroup.Text>
                            <FormControl type="number"
                                key={id + "-inputValue"}
                                value={filterNumber} onChange={e => { this.setState({ filterNumber: e.target.value }); }} />
                        </InputGroup>

                    </div>
                }

                {
                    selectedType == "categorical" &&
                    <div>

                        Select which categories you want to filter:

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
                            <Form.Select
                                key={id + "-selectCatOption"}
                                value={filterType}
                                onChange={e => { this.setState({ filterType: e.target.value }); }}
                            >
                                <option value=""></option>
                                <option value="eq">=</option>
                                <option value="isin">∈</option>
                                <option value="isnotin">∉</option>
                            </Form.Select>
                        </InputGroup>

                        {["isnotin", "isin"].includes(filterType) && <Select
                            options={categoryOptions}
                            key={id + "-selectOptions"}
                            {...multiCallbacks(
                                this,
                                (s) => this.setState(s),
                                "selectedCategories",
                                categoryOptions
                            )}
                        />}

                        {["eq"].includes(filterType) && <Select
                            options={categoryOptions}
                            isClearable
                            key={id + "-selectEqOptions"}
                            value={(selectedCategories) ? categoryOptions.filter(o => selectedCategories === o.value) : undefined}
                            onChange={selectedOption => {

                                if (selectedOption) {
                                    this.setState({ selectedCategories: selectedOption.value });
                                } else {
                                    this.setState({ selectedCategories: undefined });
                                }

                            }}
                        />}

                    </div>
                }

                {
                    selectedType == "temporal" &&
                    <div>


                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
                            <Form.Select
                                value={filterType}
                                key={id + "-selectTimeOptions"}
                                onChange={e => { this.setState({ filterType: e.target.value }); }}
                            >
                                <option value=""></option>
                                <option value="after">after</option>
                                <option value="before">before</option>
                                <option value="lastn">last days</option>
                            </Form.Select>

                        </InputGroup>
                        {filterType !== "lastn" &&
                            <DateTimePicker
                                className="w-100 border rounded"
                                value={selectedDateTime}
                                key={id + "-selectTime"}
                                onChange={newDateTime => {
                                    this.setState({
                                        selectedDateTime: newDateTime
                                    })
                                }}
                            />}

                        {filterType === "lastn" &&
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Value</InputGroup.Text>
                                <FormControl type="number" key={id + "-inputDeltaTime"}
                                    value={filterNumber} onChange={e => { this.setState({ filterNumber: e.target.value }); }} />
                            </InputGroup>
                        }

                    </div>
                }
                {
                    selectedType == "bool" &&
                    <div>


                        Select which flag you want to keep:

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
                            <Form.Select
                                value={filterType}
                                key={id + "-selectBool"}
                                onChange={e => { this.setState({ filterType: e.target.value }); }}
                            >
                                <option value=""></option>
                                <option value="istrue">True</option>
                                <option value="iffalse">False</option>
                            </Form.Select>
                        </InputGroup>


                    </div>
                }

            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleClose()}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e) => {


                    let new_filter = { col: selectedColumn, "type": "test", "value": "test" };

                    if (selectedType === "categorical") {
                        new_filter = {
                            col: selectedColumn,
                            "type": filterType, "value": selectedCategories
                        };
                        if (filterType === "" || selectedCategories.length == 0) {
                            return;
                        }
                    }
                    if (selectedType === "numerical") {
                        new_filter = {
                            col: selectedColumn, "type": filterType, "value": parseFloat(filterNumber)
                        };
                        if (filterType === "") {
                            return;
                        }
                    }

                    if (selectedType === "bool") {
                        new_filter = {
                            col: selectedColumn, "type": filterType,
                        };
                        if (filterType === "") {
                            return;
                        }
                    }

                    if (selectedType === "temporal") {

                        if (filterType !== "lastn") {
                            new_filter = {
                                col: selectedColumn, "type": filterType, "value": selectedDateTime.toISOString()
                            };
                        } else {
                            new_filter = {
                                col: selectedColumn, "type": filterType, "value": parseFloat(filterNumber)
                            };
                        }
                        if (filterType === "") {
                            return;
                        }
                    }


                    if (filterIndex === undefined) {
                        let new_config = [
                            ...config,
                            new_filter
                        ];
                        this.update_config(new_config);
                    } else {
                        let new_config = [
                            ...config
                        ];
                        new_config[filterIndex] = new_filter;
                        this.update_config(new_config);
                    }

                    this.handleClose();


                }}>
                    {(filterIndex === undefined) ? "Add" : "Update"}
                </Button>
            </Modal.Footer>
        </Modal>)

    }

    render() {
        const { id } = this.props;

        return (
            <div id={id}>
                {this.get_filter_blocks()}

                <Button className='w-100' onClick={() => {
                    this.setState({ filterIndex: undefined });
                    this.handleShow()
                }}>
                    Add filter
                </Button>

                {this.get_modal_blocks()}
            </div >
        )

    }
}



Filter.defaultProps = {};


Filter.propTypes = {

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
