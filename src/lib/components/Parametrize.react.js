import React from 'react';
import Base from './sub/Base.react';

import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import EditableList from 'react-list-editable';
import './sub/react-list-editable.css';
import Alert from 'react-bootstrap/Alert';

import Select from 'react-select';
import { singleColorStyle, multiColorStyle, hideGroupComponents, multiCallbacks } from './sub/Base.react';




export default class Parametrize extends Base {
    constructor(props) {
        super(props);


        this.state = {
            ...this.state,

            /* state of the modal to add new params or save the state */
            showAddModal: false,


            /* path to edit */
            newPath: [],
            newParameterType: "",
            newParameterName: "",
            newValue: [],
            newOptionList: [],
            newSelectedCol: undefined,
            newSelectedCols: [],
            newSelectedSubset: [],

            inputStates: {},

        };

        if ("parameterization" in this.state.config) {

            const { parameters, computeAll, computeMatrix } = this.state.config.parameterization;
            this.state = {
                ...this.state,
                parameters: (parameters) ? parameters : [],
                computeAll: (computeAll) ? computeAll : false,
                computeMatrix: (computeMatrix) ? computeMatrix : []
            };
        } else {
            this.state = {
                ...this.state,
                parameters: [],
                computeAll: false,
                computeMatrix: []
            };
        }

    }

    UNSAFE_componentWillReceiveProps(newProps) {
        super.UNSAFE_componentWillReceiveProps(newProps);

        if (newProps.config.parameterization !== this.props.parameterization) {
            this.setState({
                parameters: newProps.config.parameterization.parameters,
                computeAll: newProps.config.parameterization.computeAll,
                computeMatrix: newProps.config.parameterization.computeMatrix
            })
        }
    }


    handleAddClose() {
        this.setState({ showAddModal: false });
    }
    handleAddShow() {
        this.setState({ showAddModal: true });
    }


    saveParams(new_parameters) {
        const {
            config,
        } = this.state;

        let new_config = { ...config };

        new_config["parameterization"] = {
            parameters: new_parameters,
            computeAll: false,
            computeMatrix: []
        };

        //new_config = JSON.parse(JSON.stringify(new_config));

        this.props.setProps({
            config: new_config
        });
        this.setState({
            config: new_config
        });


    }


    get_add_modal_blocks() {

        const {
            allColOptions,
            catColOptions,
            allOptions,
            meta,
            showAddModal,
            config,
            newPath,
            newParameterType,
            newParameterName,
            newOptionList,
            newSelectedCol,
            newSelectedCols,
            newSelectedSubset
        } = this.state;

        let parameters = (this.state.parameters) ? this.state.parameters : [];



        let newSelectedSubsetOptions = (newSelectedCol) ? meta[newSelectedCol].cat.map(
            el => { return { label: el, value: el } }
        ) : [];


        let cfg_node = config;
        delete cfg_node["parameterization"];
        try {
            if (cfg_node) {
                newPath.forEach(el => { cfg_node = cfg_node[el] });
            }
        } catch {
            this.setState({ newPath: [] });
        }


        let new_path_options;
        let current_val = "";

        let isString = false;
        let isFloat = false;
        let isStringArray = false;
        let isFloatArray = false;
        let isSomething = false;
        let isArray = false;

        if (typeof (cfg_node) !== "object" || (Array.isArray(cfg_node) && typeof (cfg_node[0]) !== "object")) {
            new_path_options = "";
            current_val = JSON.stringify(cfg_node);

            isSomething = true;
            isString = typeof (cfg_node) === "string";
            isFloat = typeof (cfg_node) === "number";
            try {
                isStringArray = (Array.isArray(cfg_node) && typeof (cfg_node[0]) === "string");
                isFloatArray = (Array.isArray(cfg_node) && typeof (cfg_node[0]) === "number");
                isArray = Array.isArray(cfg_node);
            } catch { }


        } else {

            try {
                new_path_options = Object.keys(cfg_node).map(el =>
                    <Button key={"to-" + el}
                        variant="secondary"
                        className="m-1"
                        onClick={() => {
                            let dummy = [...newPath, el];
                            this.setState({ newPath: dummy });
                        }}>{el}</Button>
                )
            } catch {
                new_path_options = false;
            }
        }



        return (<Modal backdrop="static"
            show={showAddModal}
            onHide={() => this.handleAddClose()}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add parameter</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <p>
                    Select a configuration element: <br />
                    <Button
                        variant="primary"
                        className="m-1"
                        onClick={() => {
                            this.setState({ newPath: [] });
                        }}>.</Button>

                    {
                        newPath.map((el, idx) =>
                            <Button
                                variant="primary"
                                className="m-1"
                                key={"backto-" + el}
                                onClick={() => {
                                    let dummy = newPath.slice(0, idx + 1);
                                    this.setState({ newPath: dummy });
                                }}>{el}</Button>)
                    }

                    {new_path_options} <b>{current_val}</b>
                </p>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                    <FormControl value={newParameterName} onChange={e => { this.setState({ newParameterName: e.target.value }); }} />
                </InputGroup>



                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
                    <Form.Select


                        value={newParameterType}
                        onChange={e => { this.setState({ newParameterType: e.target.value }); }}

                    >
                        <option value=""></option>
                        {isString && <option value="us">user defined string</option>}
                        {isFloat && <option value="uf">user defined float</option>}
                        {isStringArray && <option value="usa">user defined string array</option>}
                        {isFloatArray && <option value="ufa">user defined float array</option>}

                        {isSomething && !isArray && <option value="o">meta options</option>}
                        {isSomething && !isArray && <option value="mos">meta option subset</option>}
                        {isSomething && !isArray && <option value="cos">column option subset</option>}
                        {isSomething && !isArray && <option value="mo">manual options</option>}



                    </Form.Select>

                </InputGroup>


                {
                    ["mo"].includes(newParameterType) &&
                    <div>
                        Add some options and press enter to keep
                        <EditableList
                            list={newOptionList}
                            className="w-100"
                            onListChange={e => this.setState({ newOptionList: e })}
                            placeholder='Enter a value'
                        />
                    </div>
                }

                {
                    ["o", "mos"].includes(newParameterType) &&
                    <div>
                        Select a column. We will use the data as a new input value.

                        <Select
                            options={catColOptions}
                            value={(newSelectedCol) ? allOptions.filter(el => newSelectedCol === el.value) : undefined}
                            onChange={o => {
                                if (o) {
                                    this.setState({ newSelectedCol: o.value });
                                } else {
                                    this.setState({ newSelectedCol: undefined });
                                }
                            }}
                            isClearable
                            styles={singleColorStyle}
                            components={hideGroupComponents}
                        />

                    </div>
                }

                {
                    newParameterType === "mos" &&
                    <div>
                        Select a column name is input value:
                        <Select
                            options={newSelectedSubsetOptions}
                            {...multiCallbacks(
                                this,
                                (s) => this.setState(s),
                                "newSelectedSubset",
                                newSelectedSubsetOptions
                            )}
                        />

                    </div>
                }


                {
                    newParameterType === "cos" &&
                    <div>
                        Select the unique options as input value:
                        <Select
                            options={allColOptions}
                            styles={multiColorStyle}
                            components={hideGroupComponents}
                            {...multiCallbacks(
                                this,
                                (s) => this.setState(s),
                                "newSelectedCols",
                                allOptions
                            )}

                        />

                    </div>
                }





            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleAddClose()}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e) => {


                    if (newParameterName.length == 0 ||
                        parameters.filter(p => p.name === newParameterName).length > 0
                    ) {
                        return;
                    }

                    let new_parameter = {
                        name: newParameterName,
                        type: newParameterType,
                        path: newPath,
                        value: cfg_node
                    }

                    if (newParameterType === "o") {
                        new_parameter["col"] = newSelectedCol;
                        new_parameter["value"] = meta[newSelectedCol].cat[0];
                    }

                    if (newParameterType === "mos") {
                        new_parameter["options"] = newSelectedSubset;
                        new_parameter["value"] = newSelectedSubset[0];
                    }
                    if (newParameterType === "cos") {
                        new_parameter["options"] = newSelectedCols;
                        new_parameter["value"] = newSelectedCols[0];

                    }
                    if (newParameterType === "mo") {
                        if (isFloatArray) {
                            newOptionList = newOptionList.map(el => parseFloat(el));
                        }
                        new_parameter["options"] = newOptionList;
                        new_parameter["value"] = newOptionList[0];
                    }


                    let new_parameters = [
                        ...parameters,
                        new_parameter
                    ];

                    this.setState({ parameters: new_parameters },
                        () => {
                            this.saveParams(new_parameters);
                            this.handleAddClose();
                        });


                }}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>)

    }



    update_config(path, value) {
        const { config, parameters } = this.state;

        let new_config = { ...config };
        new_config["parameterization"] = {
            parameters: parameters,
            computeAll: false,
            computeMatrix: []
        };

        new_config = JSON.parse(JSON.stringify(new_config));
        let path_string = "";
        path.forEach(el => {
            if (!isNaN(parseFloat(el))) {
                path_string += "[" + el + "]";
            } else {
                path_string += "." + el;
            }

        });

        eval("new_config" + path_string + " = " + JSON.stringify(value));

        this.props.setProps({
            config: new_config
        });


    }

    get_parameter_options(name, path, options) {

        let newOptions = options.map(el => { return { label: el, value: el } });

        return <Select
            options={newOptions}
            onChange={o => { this.update_config(path, o.value); }
            }
        ></Select>
    }

    get_parameter_col_options(name, path, col) {
        const { meta } = this.state;

        let newOptions = meta[col].cat.map(el => { return { label: el, value: el } });

        return <Select
            options={newOptions}
            onChange={o => { this.update_config(path, o.value); }
            }
        ></Select>
    }

    get_manual_options(name, path, value, type) {

        const { inputStates } = this.state;
        if (!(name in inputStates)) {
            inputStates[name] = value;
        }

        if (type === "us") {
            return <FormControl
                value={inputStates[name]}
                onChange={e => {

                    let new_inputStates = { ...inputStates };
                    new_inputStates[name] = e.target.value;
                    this.setState({
                        inputStates: new_inputStates
                    });
                    this.update_config(path, e.target.value);
                }}
            />
        }

        if (type === "uf") {
            return <FormControl
                value={inputStates[name]}
                type="number"
                onChange={e => {

                    let new_inputStates = { ...inputStates };
                    new_inputStates[name] = e.target.value;
                    this.setState({
                        inputStates: new_inputStates
                    });
                    let val = 0;
                    try {
                        val = parseFloat(e.target.value);
                    } catch { }
                    this.update_config(path, val);
                }}
            />
        }

        if (type === "usa") {
            return <EditableList
                list={value}
                className="w-100"
                onListChange={e => this.update_config(path, e)}
                placeholder='Enter a value'
            />
        }

    }


    get_parameter_blocks() {
        const { parameters } = this.state;

        if (parameters) {
            return <div>
                {
                    parameters.map((el, id) =>
                        <Alert dismissible key={id} onClose={() => {

                            let new_parameters = parameters.filter((e, idx) => idx !== id);
                            this.setState({ parameters: new_parameters })
                            this.saveParams(new_parameters);

                        }}><div className='ab-param-name'>{el.name}</div>


                            {("options" in el) &&
                                this.get_parameter_options(el.name, el.path, el.options)
                            }
                            {(
                                !("options" in el) &&
                                ("col" in el)) &&
                                this.get_parameter_col_options(el.name, el.path, el.col)
                            }
                            {
                                this.get_manual_options(el.name, el.path, el.value, el.type)
                            }

                        </Alert>
                    )
                }

            </div>
        }
    }


    render() {

        let { parameters } = this.state;

        return (

            <div>
                {
                    this.get_parameter_blocks()
                }

                <Button className='w-100 mb-2' onClick={() => this.handleAddShow()}>
                    Add parameter
                </Button>


                {this.get_add_modal_blocks()}

            </div>
        )

    }
}



Parametrize.defaultProps = {};


Parametrize.propTypes = {

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

