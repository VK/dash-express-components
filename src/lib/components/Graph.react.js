import React, { Component, memo, Suspense } from 'react';
import PropTypes from 'prop-types';

import { asyncDecorator } from '@plotly/dash-component-plugins';
import graph from '../utils/LazyLoader/graph';
import plotly from '../utils/LazyLoader/plotly';
import {
    privatePropTypes,
    privateDefaultProps,
} from '../fragments/Graph.privateprops';
import './css/saveClick.css';
import DataTable from './DataTable.react';
import Configurator from './Configurator.react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { prop } from 'ramda';

const EMPTY_DATA = [];

const TABLE_PNG = "data:image/png;base64,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kuucXmmavXPvZpW9Be316fVkbaRGCDDzjIAAi6kp+1NiLitJqkm5arSjlJJJaTIpTUopKbM1xkNHqlSpqiqDqs6grlMdnED7GxqUQXV1Ppk0qepqb4H6zSglVV1nePpYJs35lO1d07GAmSWAAIunlL11H9eomv1JZPv3dTuTccZlkpPLx/LS43fmvhN358TKegZVLYiQZC94TEqTp7cu5pGnv5wvPHMuT21fyLAaZGkw3Fs3lL016NeGjTKe7BUcvNkgUUqqUZ3BmWNpHjufZncshAAzSQABFkvJ3oLzJldPmblmytXWeDsby+v5d1715vz7r/nL+YY7X5mlwWj/6TZcVpJMmiY7k9384aOfyT//+Afy/3zyt/PMzrNZHS7t/6X9c+7KENJk71wcVDc/xa8pqUaD1KfX0zxxfm/3NiEEmDECCNCOWVmBXnJ56tVBf68JH5u723nl6ZfkH3zL9+Vtr3xD931k5gwGdZYGw3zzva/LN9/7urztFW/IjzzwT/LZJ7+U1dHy3l862NjgihByaSrWrcTaUlItjzI4dSyTJy7srSkRQoAZYhE6sFiuW2TwypGP3dx7/M7847f+LeGD2/Ydr3xD/udv/+G89MRd2RrvXPGVa06+kusvVH8hpaReXcrg5FpS17MR/gH2CSDAQinX7npVLgeScTPJ0mCYH3nT9+RN97y2+84xV77pnq/P337jd2epHmbc7K85unJr533POSdvVimpjy1ncHxVjRpgpgggQIvKdLfS7LWrPrf3saTJbrObb773tfmu17zliL4/LJp/7zVvyZvufW12m939jQsun3NXnYPXfu4WWr2xknpjpeu3BnDbBBBgsVz7lHj/aXQpyage5jte+cYsD0bd94u5tDJcynd8zRszqocpl4paXjsN6xALqEqSqmRwYi31seXnHhtgCgkgwOK43r3ZQb2PlCwNRvkmU69o2Rtf8vVZGowub918vfXih8kN+3VrBifXUq0tKVQITD0BBFgYz304fHnefFOarI2Wc3rleNfdYs6dWT2RtdFymnLl7mvXrAM5bGbY311reGo91eqSkRBgqtmGF2jFwTT2ab7tec5Mlyv+XJpkZbCSynamtKyu6qwMVlKa8ykHp9e1dWja2Ma6lKSuU59ay+SJJtlRqBCYTkZAAGBelJJqOMjg1PpelXUjIcAUEkAAYJ6Ukmpp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";


/**
 * Graph can be used to render any plotly.js-powered data visualization.
 *
 * You can define callbacks based on user interaction with Graphs such as
 * hovering, clicking or selecting
 */
class PlotlyGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prependData: [],
            extendData: [],
            page_current: 0,
            sort_by: [],
            filter_query: "",
            config_modal_open: false
        };

        this.clearState = this.clearState.bind(this);
        this.config_in_modal_ref = React.createRef();
    }

    componentDidMount() {

        if (this.isGraph()) {


            if (this.props.prependData) {
                this.setState({
                    prependData: [this.props.prependData],
                });
            }
            if (this.props.extendData) {
                this.setState({
                    extendData: [this.props.extendData],
                });
            }

        }
    }

    componentWillUnmount() {
        this.setState({
            prependData: [],
            extendData: [],
        });
    }

    /*Start VK addon*/

    isGraph() {
        return ("data" in this.props.figure)
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


    // sendEditData(image) {
    //     let messageData = { thumbnail: image, defs: this.props.defParams, app: window.appName, href: location.href, configuratorId: this.props.configuratorId, graphId: this.props.id };

    //     try {
    //         window.parent.postMessage(messageData, "*");
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    // editClick() {

    //     if (this.isGraph()) {
    //         //compute a thumpnail
    //         let imagePromise = Plotly.toImage(document.getElementById(this.props.id).children[1], { format: 'png', height: 400, width: 800 });
    //         //send the image data once created
    //         imagePromise.then((img) => this.sendEditData(img));
    //     } else {
    //         this.sendEditData(TABLE_PNG);

    //     }

    // }



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


    /*End VK addon*/


    UNSAFE_componentWillReceiveProps(nextProps) {
        let prependData = this.state.prependData.slice(0);

        if (this.props.figure !== nextProps.figure) {
            prependData = EMPTY_DATA;
        }

        if (
            nextProps.prependData &&
            this.props.prependData !== nextProps.prependData
        ) {
            prependData.push(nextProps.prependData);
        } else {
            prependData = EMPTY_DATA;
        }

        if (prependData !== EMPTY_DATA) {
            this.setState({
                prependData,
            });
        }

        let extendData = this.state.extendData.slice(0);

        if (this.props.figure !== nextProps.figure) {
            extendData = EMPTY_DATA;
        }

        if (
            nextProps.extendData &&
            this.props.extendData !== nextProps.extendData
        ) {
            extendData.push(nextProps.extendData);
        } else {
            extendData = EMPTY_DATA;
        }

        if (extendData !== EMPTY_DATA) {
            this.setState({
                extendData,
            });
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

        /*Start VK addon*/
        let save_button = "";
        let edit_button = "";
        if (this.props.defParams) {
            save_button = <a className="saveClickButton p-1" onClick={this.saveClick.bind(this)} key={this.props.id + "-save-button"}>
                <svg viewBox="0 -35 576 512" className="icon" height="1.5em" width="1.5em">
                    <path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z" transform="matrix(-1 0 0 1  576 0 )"></path>
                </svg>
            </a>
        }
        if (this.props.defParams && this.props.configuratorId) {
            edit_button = <a className="saveClickButton" onClick={e => this.handleOpen()} key={this.props.id + "-edit-button"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="1.3em" width="1.3em">
                    <path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                </svg>
            </a>
        }


        let configurator_modal = (
            <Modal backdrop="static" show={this.state.config_modal_open} onHide={() => this.handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title> Edit Plot Config</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Configurator ref={this.config_in_modal_ref}
                        config={this.props.defParams}
                        meta={this.props.meta}
                        showUpdate={false}
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

            return (
                <div className='pxc-graph-container'>
                    <ControlledPlotlyGraph
                        {...this.props}
                        prependData={this.state.prependData}
                        extendData={this.state.extendData}
                        clearState={this.clearState}
                    />
                    <div className="saveClickContainer" >{save_button}{edit_button}</div>
                    {configurator_modal}
                </div>
            );

        } else {

            let columns = Object.keys(this.props.figure).map(k => { return { name: k, id: k } });
            if ("defParams" in this.props) {
                try {
                    columns = this.props.defParams.plot.params.dimensions.map(k => { return { name: k, id: k } })
                } catch { }
            }

            let props = {
                id: this.props.id,
                className: this.props.className,
                data: this.props.figure,
                columns: columns,
                page_current: this.state.page_current,
                sort_by: this.state.sort_by,
                filter_query: this.state.filter_query
            }

            return (
                <div className='pxc-graph-container' style={{ padding: "5px" }}>

                    <DummyControlledTable {...props} setProps={
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
                    />

                    <div className="saveClickContainer" style={{ left: "-15px", bottom: "0px" }}>{save_button}{edit_button}</div>
                    {configurator_modal}
                </div>
            );

        }


    }
}

const RealPlotlyGraph = asyncDecorator(PlotlyGraph, () =>
    Promise.all([plotly(), graph()]).then(([, graph]) => graph)
);



const ControlledPlotlyGraph = memo(props => {
    const { className, id } = props;

    const extendedClassName = className
        ? 'dash-graph ' + className
        : 'dash-graph';

    return (
        <Suspense
            fallback={
                <div
                    id={id}
                    key={id}
                    className={`${extendedClassName} dash-graph--pending`}
                />
            }
        >
            <RealPlotlyGraph {...props} className={extendedClassName} />
        </Suspense>
    );
});



const DummyControlledTable = memo(props => {
    const { className, id } = props;

    const dummy_props = {
        id: id + "-dummy",

        "configuratorId": "topaz-waferPlot-config",
        "defParams": {
            "filter": [],
            "graphId": null,
            "labels": [],
            "name": "waferPlot",
            "parameterization": {
                "computeAll": false,
                "computeMatrix": [],
                "parameters": []
            },
            "plot": {
                "params": {},
                "type": "scatter"
            },
            "transform": []
        },
        "figure": {
            "data": [
                {
                    "hovertemplate": "CW=%{x}<br>index=%{y}<extra></extra>",
                    "legendgroup": "",
                    "marker": {
                        "color": "#636efa",
                        "symbol": "circle"
                    },
                    "mode": "markers",
                    "name": "",
                    "showlegend": false,
                    "type": "scattergl",
                    "x": [
                        "2021-22",
                        "2021-22"
                    ],
                    "xaxis": "x",
                    "y": [
                        0,
                        0
                    ],
                    "yaxis": "y"
                }
            ]
        }

    }

    const extendedClassName = className
        ? 'dash-graph ' + className
        : 'dash-graph';

    // try {
    //     let dummy = RealPlotlyGraph(props);
    //     console.log(dummy);
    // } catch { };

    return (
        <Suspense
            fallback={
                <div
                    id={id}
                    key={id}
                    className={`${extendedClassName} dash-graph--pending`}
                />
            }
        >
            <DataTable {...props} className={extendedClassName} />
        </Suspense>
    );
});



PlotlyGraph.propTypes = {
    ...privatePropTypes,

    /**
     * The ID of this component, used to identify dash components
     * in callbacks. The ID needs to be unique across all of the
     * components in an app.
     */
    id: PropTypes.string,

    /**
     * If True, the Plotly.js plot will be fully responsive to window resize
     * and parent element resize event. This is achieved by overriding
     * `config.responsive` to True, `figure.layout.autosize` to True and unsetting
     * `figure.layout.height` and `figure.layout.width`.
     * If False, the Plotly.js plot not be responsive to window resize and
     * parent element resize event. This is achieved by overriding `config.responsive`
     * to False and `figure.layout.autosize` to False.
     * If 'auto' (default), the Graph will determine if the Plotly.js plot can be made fully
     * responsive (True) or not (False) based on the values in `config.responsive`,
     * `figure.layout.autosize`, `figure.layout.height`, `figure.layout.width`.
     * This is the legacy behavior of the Graph component.
     *
     * Needs to be combined with appropriate dimension / styling through the `style` prop
     * to fully take effect.
     */
    responsive: PropTypes.oneOf([true, false, 'auto']),


    /* Start VK addon */

    /**
     * Metadata to describe the plot features
     */
    defParams: PropTypes.object,

    /**
     * id of the plotter  if a reload of the connfig should be allowed
     */
    configuratorId: PropTypes.string,

    /**
     * The metadata the plotter selection is based on.
     */
    meta: PropTypes.any,

    /* End VK addon */

    /**
     * Data from latest click event. Read-only.
     */
    clickData: PropTypes.object,

    /**
     * Data from latest click annotation event. Read-only.
     */
    clickAnnotationData: PropTypes.object,

    /**
     * Data from latest hover event. Read-only.
     */
    hoverData: PropTypes.object,

    /**
     * If True, `clear_on_unhover` will clear the `hoverData` property
     * when the user "unhovers" from a point.
     * If False, then the `hoverData` property will be equal to the
     * data from the last point that was hovered over.
     */
    clear_on_unhover: PropTypes.bool,

    /**
     * Data from latest select event. Read-only.
     */
    selectedData: PropTypes.object,

    /**
     * Data from latest relayout event which occurs
     * when the user zooms or pans on the plot or other
     * layout-level edits. Has the form `{<attr string>: <value>}`
     * describing the changes made. Read-only.
     */
    relayoutData: PropTypes.object,

    /**
     * Data that should be appended to existing traces. Has the form
     * `[updateData, traceIndices, maxPoints]`, where `updateData` is an object
     * containing the data to extend, `traceIndices` (optional) is an array of
     * trace indices that should be extended, and `maxPoints` (optional) is
     * either an integer defining the maximum number of points allowed or an
     * object with key:value pairs matching `updateData`
     * Reference the Plotly.extendTraces API for full usage:
     * https://plotly.com/javascript/plotlyjs-function-reference/#plotlyextendtraces
     */
    extendData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),

    /**
     * Data that should be prepended to existing traces. Has the form
     * `[updateData, traceIndices, maxPoints]`, where `updateData` is an object
     * containing the data to prepend, `traceIndices` (optional) is an array of
     * trace indices that should be prepended, and `maxPoints` (optional) is
     * either an integer defining the maximum number of points allowed or an
     * object with key:value pairs matching `updateData`
     * Reference the Plotly.prependTraces API for full usage:
     * https://plotly.com/javascript/plotlyjs-function-reference/#plotlyprependtraces
     */
    prependData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),

    /**
     * Data from latest restyle event which occurs
     * when the user toggles a legend item, changes
     * parcoords selections, or other trace-level edits.
     * Has the form `[edits, indices]`, where `edits` is an object
     * `{<attr string>: <value>}` describing the changes made,
     * and `indices` is an array of trace indices that were edited.
     * Read-only.
     */
    restyleData: PropTypes.array,

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
     * className of the parent div
     */
    className: PropTypes.string,

    /**
     * Beta: If true, animate between updates using
     * plotly.js's `animate` function
     */
    animate: PropTypes.bool,

    /**
     * Beta: Object containing animation settings.
     * Only applies if `animate` is `true`
     */
    animation_options: PropTypes.object,

    /**
     * Plotly.js config options.
     * See https://plotly.com/javascript/configuration-options/
     * for more info.
     */
    config: PropTypes.exact({
        /**
         * No interactivity, for export or image generation
         */
        staticPlot: PropTypes.bool,

        /**
         * Base URL for a Plotly cloud instance, if `showSendToCloud` is enabled
         */
        plotlyServerURL: PropTypes.string,

        /**
         * We can edit titles, move annotations, etc - sets all pieces of `edits`
         * unless a separate `edits` config item overrides individual parts
         */
        editable: PropTypes.bool,

        /**
         * A set of editable properties
         */
        edits: PropTypes.exact({
            /**
             * The main anchor of the annotation, which is the
             * text (if no arrow) or the arrow (which drags the whole thing leaving
             * the arrow length & direction unchanged)
             */
            annotationPosition: PropTypes.bool,

            /**
             * Just for annotations with arrows, change the length and direction of the arrow
             */
            annotationTail: PropTypes.bool,

            annotationText: PropTypes.bool,

            axisTitleText: PropTypes.bool,

            colorbarPosition: PropTypes.bool,

            colorbarTitleText: PropTypes.bool,

            legendPosition: PropTypes.bool,

            /**
             * Edit the trace name fields from the legend
             */
            legendText: PropTypes.bool,

            shapePosition: PropTypes.bool,

            /**
             * The global `layout.title`
             */
            titleText: PropTypes.bool,
        }),

        /**
         * DO autosize once regardless of layout.autosize
         * (use default width or height values otherwise)
         */
        autosizable: PropTypes.bool,

        /**
         * Whether to change layout size when the window size changes
         */
        responsive: PropTypes.bool,

        /**
         * Set the length of the undo/redo queue
         */
        queueLength: PropTypes.number,

        /**
         * If we DO autosize, do we fill the container or the screen?
         */
        fillFrame: PropTypes.bool,

        /**
         * If we DO autosize, set the frame margins in percents of plot size
         */
        frameMargins: PropTypes.number,

        /**
         * Mousewheel or two-finger scroll zooms the plot
         */
        scrollZoom: PropTypes.bool,

        /**
         * Double click interaction (false, 'reset', 'autosize' or 'reset+autosize')
         */
        doubleClick: PropTypes.oneOf([
            false,
            'reset',
            'autosize',
            'reset+autosize',
        ]),

        /**
         * Delay for registering a double-click event in ms. The
         * minimum value is 100 and the maximum value is 1000. By
         * default this is 300.
         */
        doubleClickDelay: PropTypes.number,

        /**
         * New users see some hints about interactivity
         */
        showTips: PropTypes.bool,

        /**
         * Enable axis pan/zoom drag handles
         */
        showAxisDragHandles: PropTypes.bool,

        /**
         * Enable direct range entry at the pan/zoom drag points
         * (drag handles must be enabled above)
         */
        showAxisRangeEntryBoxes: PropTypes.bool,

        /**
         * Link to open this plot in plotly
         */
        showLink: PropTypes.bool,

        /**
         * If we show a link, does it contain data or just link to a plotly file?
         */
        sendData: PropTypes.bool,

        /**
         * Text appearing in the sendData link
         */
        linkText: PropTypes.string,

        /**
         * Display the mode bar (true, false, or 'hover')
         */
        displayModeBar: PropTypes.oneOf([true, false, 'hover']),

        /**
         * Should we include a modebar button to send this data to a
         * Plotly Cloud instance, linked by `plotlyServerURL`.
         * By default this is false.
         */
        showSendToCloud: PropTypes.bool,

        /**
         * Should we show a modebar button to send this data to a
         * Plotly Chart Studio plot. If both this and showSendToCloud
         * are selected, only showEditInChartStudio will be
         * honored. By default this is false.
         */
        showEditInChartStudio: PropTypes.bool,

        /**
         * Remove mode bar button by name.
         * All modebar button names at https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
         * Common names include:
         * sendDataToCloud;
         * (2D) zoom2d, pan2d, select2d, lasso2d, zoomIn2d, zoomOut2d, autoScale2d, resetScale2d;
         * (Cartesian) hoverClosestCartesian, hoverCompareCartesian;
         * (3D) zoom3d, pan3d, orbitRotation, tableRotation, handleDrag3d, resetCameraDefault3d, resetCameraLastSave3d, hoverClosest3d;
         * (Geo) zoomInGeo, zoomOutGeo, resetGeo, hoverClosestGeo;
         * hoverClosestGl2d, hoverClosestPie, toggleHover, resetViews.
         */
        modeBarButtonsToRemove: PropTypes.array,

        /**
         * Add mode bar button using config objects
         */
        modeBarButtonsToAdd: PropTypes.array,

        /**
         * Fully custom mode bar buttons as nested array,
         * where the outer arrays represents button groups, and
         * the inner arrays have buttons config objects or names of default buttons
         */
        modeBarButtons: PropTypes.any,

        /**
         * Modifications to how the toImage modebar button works
         */
        toImageButtonOptions: PropTypes.exact({
            /**
             * The file format to create
             */
            format: PropTypes.oneOf(['jpeg', 'png', 'webp', 'svg']),
            /**
             * The name given to the downloaded file
             */
            filename: PropTypes.string,
            /**
             * Width of the downloaded file, in px
             */
            width: PropTypes.number,
            /**
             * Height of the downloaded file, in px
             */
            height: PropTypes.number,
            /**
             * Extra resolution to give the file after
             * rendering it with the given width and height
             */
            scale: PropTypes.number,
        }),

        /**
         * Add the plotly logo on the end of the mode bar
         */
        displaylogo: PropTypes.bool,

        /**
         * Add the plotly logo even with no modebar
         */
        watermark: PropTypes.bool,

        /**
         * Increase the pixel ratio for Gl plot images
         */
        plotGlPixelRatio: PropTypes.number,

        /**
         * URL to topojson files used in geo charts
         */
        topojsonURL: PropTypes.string,

        /**
         * Mapbox access token (required to plot mapbox trace types)
         * If using an Mapbox Atlas server, set this option to '',
         * so that plotly.js won't attempt to authenticate to the public Mapbox server.
         */
        mapboxAccessToken: PropTypes.any,

        /**
         * The locale to use. Locales may be provided with the plot
         * (`locales` below) or by loading them on the page, see:
         * https://github.com/plotly/plotly.js/blob/master/dist/README.md#to-include-localization
         */
        locale: PropTypes.string,

        /**
         * Localization definitions, if you choose to provide them with the
         * plot rather than registering them globally.
         */
        locales: PropTypes.object,
    }),

    /**
     * Function that updates the state tree.
     */
    setProps: PropTypes.func,

    /**
     * Object that holds the loading state object coming from dash-renderer
     */
    loading_state: PropTypes.shape({
        /**
         * Determines if the component is loading or not
         */
        is_loading: PropTypes.bool,
        /**
         * Holds which property is loading
         */
        prop_name: PropTypes.string,
        /**
         * Holds the name of the component that is loading
         */
        component_name: PropTypes.string,
    }),
};

ControlledPlotlyGraph.propTypes = PlotlyGraph.propTypes;
//ControlledTable.propTypes = PlotlyGraph.propTypes;

PlotlyGraph.defaultProps = {
    ...privateDefaultProps,

    defParams: null,
    configuratorId: null,
    meta: null,

    clickData: null,
    clickAnnotationData: null,
    hoverData: null,
    selectedData: null,
    relayoutData: null,
    prependData: null,
    extendData: null,
    restyleData: null,
    figure: {
        data: [],
        layout: {},
        frames: [],
    },
    responsive: 'auto',
    animate: false,
    animation_options: {
        frame: {
            redraw: false,
        },
        transition: {
            duration: 750,
            ease: 'cubic-in-out',
        },
    },
    clear_on_unhover: false,
    config: {},
};

export const graphPropTypes = PlotlyGraph.propTypes;
export const graphDefaultProps = PlotlyGraph.defaultProps;

export default PlotlyGraph;
