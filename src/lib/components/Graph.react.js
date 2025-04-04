import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/saveClick.css';

import CoreGraph from './_core/CoreGraph.react';
import CoreDataTable from './_core/CoreDataTable.react';
import Configurator from './Configurator.react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const EMPTY_DATA = [];

const TABLE_PNG = "data:image/png;base64,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kuucXmmavXPvZpW9Be316fVkbaRGCDDzjIAAi6kp+1NiLitJqkm5arSjlJJJaTIpTUopKbM1xkNHqlSpqiqDqs6grlMdnED7GxqUQXV1Ppk0qepqb4H6zSglVV1nePpYJs35lO1d07GAmSWAAIunlL11H9eomv1JZPv3dTuTccZlkpPLx/LS43fmvhN358TKegZVLYiQZC94TEqTp7cu5pGnv5wvPHMuT21fyLAaZGkw3Fs3lL016NeGjTKe7BUcvNkgUUqqUZ3BmWNpHjufZncshAAzSQABFkvJ3oLzJldPmblmytXWeDsby+v5d1715vz7r/nL+YY7X5mlwWj/6TZcVpJMmiY7k9384aOfyT//+Afy/3zyt/PMzrNZHS7t/6X9c+7KENJk71wcVDc/xa8pqUaD1KfX0zxxfm/3NiEEmDECCNCOWVmBXnJ56tVBf68JH5u723nl6ZfkH3zL9+Vtr3xD931k5gwGdZYGw3zzva/LN9/7urztFW/IjzzwT/LZJ7+U1dHy3l862NjgihByaSrWrcTaUlItjzI4dSyTJy7srSkRQoAZYhE6sFiuW2TwypGP3dx7/M7847f+LeGD2/Ydr3xD/udv/+G89MRd2RrvXPGVa06+kusvVH8hpaReXcrg5FpS17MR/gH2CSDAQinX7npVLgeScTPJ0mCYH3nT9+RN97y2+84xV77pnq/P337jd2epHmbc7K85unJr533POSdvVimpjy1ncHxVjRpgpgggQIvKdLfS7LWrPrf3saTJbrObb773tfmu17zliL4/LJp/7zVvyZvufW12m939jQsun3NXnYPXfu4WWr2xknpjpeu3BnDbBBBgsVz7lHj/aXQpyage5jte+cYsD0bd94u5tDJcynd8zRszqocpl4paXjsN6xALqEqSqmRwYi31seXnHhtgCgkgwOK43r3ZQb2PlCwNRvkmU69o2Rtf8vVZGowub918vfXih8kN+3VrBifXUq0tKVQITD0BBFgYz304fHnefFOarI2Wc3rleNfdYs6dWT2RtdFymnLl7mvXrAM5bGbY311reGo91eqSkRBgqtmGF2jFwTT2ab7tec5Mlyv+XJpkZbCSynamtKyu6qwMVlKa8ykHp9e1dWja2Ma6lKSuU59ay+SJJtlRqBCYTkZAAGBelJJqOMjg1PpelXUjIcAUEkAAYJ6Ukmpp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";


//generates random id;
let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * <div style="width:450px; margin-left: 20px; float: right;  margin-top: -150px;">
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/graph.png"/>
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/graph-table.png"/>
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/graph-modal.png"/>
 * </div>
 * 
 * 
 * The `Graph` component is a combination of the original dash `Graph` and the dash `data_table`.
 *
 * It can not only be used to render a plotly.js-powered data visualization,
 * but also shows a searchable table, if only data is submitted.
 * 
 * In addition, there is the possibility to add plot parameters as `defParams` and 
 * the dataframe `meta` data.  
 * This automatically adds a configurator modal, which can be opened via a button
 * at the bottom right.
 * 
 * 
 * @hideconstructor
 * 
 * @example
 * import dash_express_components as dxc
 * import plotly.express as px
 * 
 * meta = dxc.get_meta(px.data.gapminder())
 * 
 * dxc.Graph(
 *     id="fig",
 *     meta=meta,
 *     defParams={}
 * )
 * @public
 */
class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prependData: [],
            extendData: [],
            //page_current: 0,
            sort_by: [],
            is_loading: false,
            filter_query: "",
            config_modal_open: false,
            defParams: props.defParams,
            hiddenColumns: props.hiddenColumns,
            meta: this.filterMeta(props.meta),
            internalFigure: { data: [] }
        };

        this.clearState = this.clearState.bind(this);
        this.config_in_modal_ref = React.createRef();
        this.config_modal_id = guid();
    }

    filterMeta(meta) { 
    // remove the hiddenColums from the meta
        const hiddenColumns = (this.state && this.state.hiddenColumns) ? this.state.hiddenColumns : this.props.hiddenColumns;
        
        if (typeof meta === "object") {
            for (let key in meta) {
                if (hiddenColumns.includes(key)) {
                    delete meta[key];
                }
            }
        }
        
        return meta;
    }

    componentDidMount() {
        if ("plotApi" in this.props && "defParams" in this.props) {
            this.setState({ is_loading: true });

            let that = this;

            setTimeout(() => {
                that.update_figure_from_defParams(that.props.defParams, true);
            }, 200);

        }
    }


    isGraph() {
        try {
            if ("plotApi" in this.props && this.props.plotApi !== "") {
                return ("internalFigure" in this.state && "data" in this.state.internalFigure)
            } else {
                return ("data" in this.props.figure)
            }
        } catch (e) {
            return ("data" in this.props.figure)
        }
    }


    sendSavedData(image) {
        let messageData = { thumbnail: image, defs: this.props.defParams, app: window.appName, href: location.href };

        try {
            window.parent.postMessage(messageData, "*");
        } catch (e) {
            console.log(e);
        }
    }
    saveClick() {
        if (this.isGraph()) {
            //compute a thumpnail
            let imagePromise = Plotly.toImage(document.getElementById(this.props.id).children[1], { format: 'png', height: 400, width: 800 });
            //send the image data once created
            imagePromise.then((img) => this.sendSavedData(img));
        } else {
            this.sendSavedData(TABLE_PNG);
        }
    }



    handleOpen() {
        this.setState({ config_modal_open: true });

        let that = this;
        setTimeout(() => {
            that.config_in_modal_ref.current.update_config(this.props.defParams);
        }, 200);
    }

    handleClose() {
        this.setState({ config_modal_open: false });
    }

    inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    usePlotApi() {
        try {
            return "plotApi" in this.props && this.props.plotApi !== "";
        } catch (e) {
            return false;
        }
    }

    update_figure_from_defParams(input_params, initial = true) {
        let defParams = JSON.parse(JSON.stringify(input_params));

        if (!initial) {
            this.setState({ defParams: defParams });
        }

        this.setState({ is_loading: true });

        const handleResponse = (xhr) => {
            if (xhr.status === 200) {
                if (xhr.responseText !== "") {
                    try {
                        var data = JSON.parse(xhr.responseText);

                        // Handling the response data accordingly
                        if ("plots" in data) {
                            data = data.plots;
                            if (Array.isArray(data)) {
                                data = data[0];
                            }
                        }

                        if ("meta" in data) {
                            const { meta, ...figdata } = data;
                            this.setState({ internalFigure: figdata, meta: this.filterMeta(data.meta) });
                        } else {
                            this.setState({ internalFigure: data });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    this.setState({ is_loading: false });
                }
            } else if (xhr.status === 202) {
                // Retry the request if status is 202 (Accepted)
                setTimeout(() => {
                    sendRequest(defParams);
                }, 1000); // Adjust the retry interval as needed
            } else {
                this.setState({ is_loading: false });
            }
        };

        const handleTimeout = () => {
            // Handle timeout situations if needed
            this.setState({ is_loading: false });
        };

        const handleLongCallback = (xhr) => {
            if (this.props.longCallback) {
                xhr.setRequestHeader('X-Longcallback', 'true');
            }
        };

        const sortedObject = (obj) => {
            if (typeof obj !== "object" || obj === null) return obj;

            if (Array.isArray(obj)) return obj.map(sortedObject);

            const ordered = {};
            Object.keys(obj).sort().forEach(function (key) {
                ordered[key] = sortedObject(obj[key]);
            });
            return ordered;
        }

        const sortedStringify = (obj) => {
            return JSON.stringify(sortedObject(obj));
        }

        const sendRequest = (send_data) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", this.props.plotApi, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            handleLongCallback(xhr);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    handleResponse(xhr);
                }
            };

            xhr.ontimeout = handleTimeout;

            xhr.send(sortedStringify(send_data));
        };

        let send_data = JSON.parse(JSON.stringify(defParams));
        if (["auto", "png"].includes(send_data["plot"]["params"]["render"])) {
            if (send_data["plot"]["params"]["render_size"] === undefined) {
                try {
                    send_data["plot"]["params"]["render_size"] = [this.graphDiv.clientWidth, this.graphDiv.clientHeight];
                } catch (e) { }
            }
        }

        sendRequest(send_data);
    }

    /**
     * if the plot config changes and the extra plotApi should be used
     * Then we have to update the content
     * @private
     */
    UNSAFE_componentWillReceiveProps(newProps) {

        if (this.usePlotApi()) {
            if (newProps.defParams !== this.state.defParams) {

                if (JSON.stringify(newProps.defParams) !== JSON.stringify(this.state.defParams)) {
                    this.update_figure_from_defParams(newProps.defParams, false);
                }

            }
        }

        if (newProps.figure !== this.state.internalFigure) {

            // remove meta from figure
            if (newProps.figure && newProps.figure.meta) {
                let { meta, ...figure } = newProps.figure;
                this.setState({ figure: figure });
            } else {
                this.setState({ figure: newProps.figure });
            }

        }

        if (newProps.meta !== this.state.meta && newProps.meta && newProps.meta.length !== undefined) {
                this.setState({ meta: this.filterMeta(newProps.meta) });
        }

    }

    clearState(dataKey) {

        this.setState(props => {
            var data = props[dataKey];
            const res =
                data && data.length
                    ? {
                        [dataKey]: EMPTY_DATA,
                    }
                    : undefined;

            return res;
        });
    }


    render() {


        const spinnerClass = this.state.is_loading ? "dxc-spinner-container" : "dxc-spinner-container dxc-spinner-hidden";

        /*Start VK addon*/
        let save_button = "";
        let edit_button = "";
        if (this.props.defParams && this.inIframe() && this.props.saveClick) {
            save_button = <a className="saveClickButton p-1" onClick={this.saveClick.bind(this)} key={this.props.id + "-save-button"}>
                <svg viewBox="0 -35 576 512" className="icon" height="1.5em" width="1.5em">
                    <path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z" transform="matrix(-1 0 0 1  576 0 )"></path>
                </svg>
            </a>
        }
        if (this.props.defParams && this.state.meta && this.props.editButton) {
            edit_button = <a className="saveClickButton" onClick={e => this.handleOpen()} key={this.props.id + "-edit-button"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="1.3em" width="1.3em">
                    <path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                </svg>
            </a>
        }


        let config_meta = (this.state.meta) ? this.state.meta : this.props.meta
        config_meta = (config_meta) ? config_meta : {}
        let configurator_modal = (
            <Modal
                centered
                backdrop="static"
                animation={false}
                show={this.state.config_modal_open}
                onHide={() => this.handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title> Edit Plot Config</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Configurator ref={this.config_in_modal_ref}
                        id={this.config_modal_id}
                        config={this.props.defParams}
                        meta={config_meta}
                        showUpdate={false}
                        showFilter={this.props.showFilter}
                        showTransform={this.props.showTransform}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleClose()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={(e) => {

                        this.props.setProps({
                            defParams:
                                this.config_in_modal_ref.current.state.config
                        });

                        this.handleClose();
                    }}>
                        Update Plot
                    </Button>
                </Modal.Footer>
            </Modal>
        )

        /*End VK addon*/

        if (this.isGraph()) {

            if (this.usePlotApi()) {

                let inner_props = {
                    ...this.props,
                    figure: this.state.internalFigure
                }

                return (
                    <div className='pxc-graph-container' ref={(divElement) => { this.graphDiv = divElement }}>
                        <div className={spinnerClass}><div className="dxc-spinner-border" role="status"><span className="sr-only"></span></div>
                        </div>
                        <CoreGraph
                            {...inner_props}
                            clearState={this.clearState}
                        />
                        <div className="saveClickContainer" >{save_button}{edit_button}</div>
                        {configurator_modal}
                    </div>
                );

            } else {
                return (
                    <div className='pxc-graph-container' ref={(divElement) => { this.graphDiv = divElement }}>
                        <div className={spinnerClass}><div className="dxc-spinner-border" role="status"><span className="sr-only"></span></div>
                        </div>
                        <CoreGraph
                            {...this.props}
                            clearState={this.clearState}
                        />
                        <div className="saveClickContainer" >{save_button}{edit_button}</div>
                        {configurator_modal}
                    </div>
                );
            }

        } else {

            let columns = [];

            if (this.usePlotApi()) {
                columns = Object.keys(this.state.internalFigure).map(k => { return { name: k, id: k, hideable:false } });
            } else {
                columns = Object.keys(this.props.figure).map(k => { return { name: k, id: k, hideable:false } });
            }
            if ("defParams" in this.props) {
                try {
                    columns = this.props.defParams.plot.params.dimensions.map(k => { return { name: k, id: k, hideable:false } })
                } catch { }
            }


            const hiddenColumns = (this.state && this.state.hiddenColumns) ? this.state.hiddenColumns : this.props.hiddenColumns;
            let props = {
                id: this.props.id,
                className: this.props.className,
                data: this.props.figure,
                columns: columns,
                //page_current: this.state.page_current,
                sort_by: this.state.sort_by,
                filter_query: this.state.filter_query,
                virtualization: true,
                page_action: 'none',
                fixed_rows: { headers: true, data: 0 },
                style_table: { height: '300px', overflowY: 'auto' },
                style_cell: { 'minWidth': '50px', fontSize: "14px" },
                hidden_columns: hiddenColumns,
            }

            if (this.usePlotApi()) {
                props.data = this.state.internalFigure;
            }



            return (
                <div className='pxc-graph-container' style={{ padding: "5px" }}>
                    <div className={spinnerClass}><div className="dxc-spinner-border" role="status"><span className="sr-only"></span></div>
                    </div>

                    {(!this.state.is_loading) && <CoreDataTable {...props} setProps={
                        el => {

                            if (("selectedData" in el) || ("prependData" in el) || ("extendData" in el)) {
                                this.props.setProps(el);
                            } else {

                                if (
                                    ("page_current" in el && el.page_current !== this.state.page_current) ||
                                    ("sort_by" in el && el.sort_by !== this.state.sort_by) ||
                                    ("filter_query" in el && el.filter_query !== this.state.filter_query)
                                ) {
                                    this.setState(el);
                                }

                            }
                        }
                    }
                    />}

                    <div className="saveClickContainer" style={{ position: "relative", left: "-20px", bottom: "0px" }}>{save_button}{edit_button}</div>
                    {configurator_modal}
                </div>
            );

        }


    }
}


/**
 * @typedef
 * @public
 * @enum {}
 */
Graph.propTypes = {

    /**
     * The ID of this component, used to identify dash components
     * in callbacks. The ID needs to be unique across all of the
     * components in an app.
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * Configuration to describe the plot features
     */
    defParams: PropTypes.object,


    /**
     * The metadata the plotter selection is based on.
     */
    meta: PropTypes.any,

    /**
     * Url to the plot Api
     */
    plotApi: PropTypes.string,

    /**
     * Plotly `figure` object. See schema:
     * https://plotly.com/javascript/reference
     *
     * `config` is set separately by the `config` property
     */
    figure: PropTypes.any,

    /**
     * Generic style overrides on the plot div
     */
    style: PropTypes.object,

    /**
     * The data selected in the plot or in the table
     */
    selectedData: PropTypes.any,

    /**
     * className of the parent div
     */
    className: PropTypes.string,

    /**
     * enable/disable saveClick button
     */
    saveClick: PropTypes.bool,

    /**
     * enable/disable long callbacks
     */
    longCallback: PropTypes.bool,

    /**
     * enable/disable edit button
     */
    editButton: PropTypes.bool,


    /**
     * The current configuration of the plot.
     * @type {Object}
     */
    currentConfig: PropTypes.any,


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
     * Function that updates the state tree.
     */
    setProps: PropTypes.func,


    /**
     * hidden column names (array of strings)
     */
    hiddenColumns: PropTypes.array,

};


Graph.defaultProps = {
    meta: null,
    figure: {
        data: [],
        layout: {},
        frames: [],
    },
    style: null,
    saveClick: false,
    editButton: true,
    longCallback: false,
    showFilter: true,
    showTransform: true,
    className: "",
    plotApi: "",
    hiddenColumns: ["_id", "index"],
};



/**
 * @private
 */
export default Graph;
