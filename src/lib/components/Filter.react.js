import { isNil, pluck } from 'ramda';
import React from 'react';
import Base from './Base.react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import VirtualizedSelect from 'react-virtualized-select';
import Accordion from 'react-bootstrap/Accordion';
import DateTimePicker from 'react-datetime-picker';

export default class Filter extends Base {
    constructor(props) {
        super(props);



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

            filterType: ""


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
            if (el.col in new_meta) {
                if (el.type in ["gt", "gte"]) {
                    new_meta[el.col].min = el.value
                }
                if (el.type in ["lt", "lte"]) {
                    new_meta[el.col].max = el.value
                }
                if (el.type === "isin") {
                    new_meta[el.col].cat = new_meta[el.col].cat.filter(
                        ael => el.value.indexOf(ael) !== -1
                    )
                }
                if (el.type === "isnotin") {
                    new_meta[el.col].cat = new_meta[el.col].cat.filter(
                        ael => el.value.indexOf(ael) === -1
                    )
                }
            }
        });

        console.log(new_meta);
        super.update_meta_out(new_meta);
    }

    filter_to_string(el) {

        console.log(el);

        let translate = {
            isin: "∈",
            isnotin: "∉",
            gt: ">",
            gte: "≥",
            lt: "<",
            lte: "≤",
            eq: "=",
            neq: "≠",
        }

        if (el["type"] === "isin" || el["type"] === "isnotin") {
            return <span><b>{el.col}</b> {translate[el["type"]]} [{el.value.join(', ')}]</span>;
        }


        return <span><b>{el.col}</b> {translate[el["type"]]} {el.value}</span>;

    }

    get_filter_blocks() {
        const { config } = this.state;

        if (config) {
            return <div>
                {
                    config.map((el, id) =>
                        <Alert dismissible key={id} onClose={() => {

                            let new_config = config.filter((e, idx) => idx !== id);
                            this.update_config(new_config)

                        }}>{this.filter_to_string(el)}</Alert>
                    )
                }

            </div>
        }
    }

    get_modal_blocks() {

        const {
            allColOptions,
            showAddModal,
            selectedColumn, selectedType,
            categoryOptions, selectedCategories,
            selectedDateTime,
            filterType,
            config, meta } = this.state;

        return (<Modal backdrop="static"
            show={showAddModal}
            onHide={() => this.handleClose()}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add filter</Modal.Title>
            </Modal.Header>
            <Modal.Body><div style={{ minHeight: "15em" }} className="mb-3">

                Please specify the column you want to filter.

                <VirtualizedSelect

                    options={allColOptions}

                    value={selectedColumn}
                    onChange={selectedOption => {

                        let value;
                        let type;
                        if (isNil(selectedOption)) {
                            value = null;
                            type = null;
                        } else {
                            value = selectedOption.value;
                            type = meta[value].type;
                        }

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


                />

                {
                    selectedType == "numerical" &&
                    <div>numerical</div>
                }

                {
                    selectedType == "categorical" &&
                    <div>

                        Select which categories you want to filter:

                        <Form.Select

                            value={filterType}
                            onChange={e => { this.setState({ filterType: e.target.value }); }}

                        >
                            <option value=""></option>
                            <option value="isin">∈</option>
                            <option value="isnotin">∉</option>
                        </Form.Select>

                        <VirtualizedSelect
                            options={categoryOptions} multi

                            value={selectedCategories}
                            onChange={selectedOption => {
                                let value;
                                if (isNil(selectedOption)) {
                                    value = [];
                                } else {
                                    value = pluck('value', selectedOption);
                                }
                                this.setState({
                                    selectedCategories:
                                        value
                                });
                            }}
                        />

                    </div>
                }

                {
                    selectedType == "temporal" &&
                    <div>

                        <DateTimePicker
                            className="w-100 border rounded"
                            value={selectedDateTime}
                            onChange={newDateTime => {
                                this.setState({
                                    selectedDateTime: newDateTime
                                })
                            }}
                        />

                    </div>
                }
                {
                    selectedType == "bool" &&
                    <div>bool</div>
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
                    let new_config = [
                        new_filter,
                        ...config
                    ];

                    this.update_config(new_config);

                    this.handleClose();


                }}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>)

    }

    render() {

        return (
            <Accordion.Item eventKey="filter">
                <Accordion.Header>Filter</Accordion.Header>
                <Accordion.Body>
                    {this.get_filter_blocks()}

                    <Button className='w-100' onClick={() => this.handleShow()}>
                        Add Filter
                    </Button>

                    {this.get_modal_blocks()}
                </Accordion.Body>

            </Accordion.Item>
        )

    }
}



Filter.defaultProps = {};


Filter.propTypes = {

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
