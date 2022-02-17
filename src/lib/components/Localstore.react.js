import React from 'react';
import Base from './_sub/Base.react';

import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';






export default class Localstore extends Base {
    constructor(props) {
        super({}, props);

        this.state = {
            ...this.state,
            store: this.getStore(),

            showLoadModal: false,

            /* params to save or load a preset */
            selectedName: undefined,
            newName: "",

        };

        this.state.selectedName = (this.state.store.length > 0) ? this.state.store[0].name : "";

    }



    UNSAFE_componentWillReceiveProps(newProps) {
        super.UNSAFE_componentWillReceiveProps(newProps);
    }

    getStore() {
        let res = localStorage.getItem('dash_express_plot_configs');

        if (res) {
            return JSON.parse(res);
        } else {
            return []
        }

    }


    saveStore(new_store) {
        this.setState({
            store: new_store
        });
        localStorage.setItem('dash_express_plot_configs', JSON.stringify(new_store));
    }

    handleLoadClose() {
        this.setState({ showLoadModal: false });
    }
    handleLoadShow() {
        this.setState({ showLoadModal: true });
    }



    get_load_modal_blocks() {

        const {
            showLoadModal, config, store, selectedName, newName
        } = this.state;


        return (<Modal
            backdrop="static"
            animation={false}
            show={showLoadModal}
            onHide={() => this.handleLoadClose()}
        >
            <Modal.Header closeButton>
                <Modal.Title>Load and save config</Modal.Title>
            </Modal.Header>
            <Modal.Body>


                <InputGroup className="mb-3">

                    <Form.Select
                        value={selectedName}
                        onChange={e => { this.setState({ selectedName: e.target.value }); }}
                    >
                        {store.map(n => <option key={"st-" + n.name} value={n.name}>{n.name}</option>)}
                    </Form.Select>

                    <Button onClick={e => {
                        const new_configs = store.filter(el => el.name === selectedName);
                        if (new_configs.length > 0) {
                            const new_config = new_configs[0].config;
                            this.props.setProps({
                                config: new_config
                            })
                            this.handleLoadClose();
                        }

                    }}>

                        Load
                    </Button>

                </InputGroup>


                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Save</InputGroup.Text>
                    <FormControl value={newName} onChange={e => {
                        this.setState({ newName: e.target.value }
                        );
                    }} />
                    <Button onClick={e => {
                        let new_store = store.filter(el => el.name != newName);
                        new_store.push({
                            name: newName,
                            config: config
                        })
                        this.saveStore(new_store);
                        this.handleLoadClose();
                    }}>
                        Save
                    </Button>
                </InputGroup>


            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleLoadClose()}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>)

    }




    render() {
        return (

            <div>
                <p>
                    The local browser cache can be used to store plot configurations.
                    This data can be easily lost! So please do not use it as a permanent storage solution.
                </p>

                <Button className='w-100' onClick={() => this.handleLoadShow()}>
                    Load / Save
                </Button>

                {this.get_load_modal_blocks()}
            </div>
        )

    }

}













Localstore.defaultProps = {};


Localstore.propTypes = {

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

