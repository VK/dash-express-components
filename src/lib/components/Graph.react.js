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

const EMPTY_DATA = [];

/**
 * Graph can be used to render any plotly.js-powered data visualization.
 *
 * You can define callbacks based on user interaction with Graphs such as
 * hovering, clicking or selecting
 */
class PlotlyGraph extends Component {
    constructor(props) {
        super(props);

        plotly();

        this.state = {
            prependData: [],
            extendData: [],
        };

        this.clearState = this.clearState.bind(this);
    }

    componentDidMount() {
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

    componentWillUnmount() {
        this.setState({
            prependData: [],
            extendData: [],
        });
    }


    /*Start VK addon*/
    sendSavedData(image) {
        let messageData = { thumbnail: image, defs: this.props.defParams, app: window.appName, href: location.href };

        try {
            window.parent.postMessage(messageData, "*");
        } catch (e) {
            console.log(e);
        }
    }
    saveClick() {
        //compute a thumpnail
        let imagePromise = Plotly.toImage(document.getElementById(this.props.id).children[1], { format: 'png', height: 400, width: 800 });
        //send the image data once created
        imagePromise.then((img) => this.sendSavedData(img));
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
        let button = "";
        if (this.props.defParams) {
            button = <div class="saveClickContainer">
                <a class="saveClickButton p-1" onClick={this.saveClick.bind(this)}>
                    <svg viewBox="0 -35 576 512" className="icon" height="1.5em" width="1.5em">
                        <path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z" transform="matrix(-1 0 0 1  576 0 )"></path>
                    </svg>
                </a>

                <a class="saveClickButton" onClick={this.saveClick.bind(this)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="1.3em" width="1.3em">
                        <path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                    </svg>
                </a>
            </div>

        }
        /*End VK addon*/

        return (
            <div style={{ width: "100%", height: "100%" }}>
                <ControlledPlotlyGraph
                    {...this.props}
                    prependData={this.state.prependData}
                    extendData={this.state.extendData}
                    clearState={this.clearState}
                />
                {button}
            </div>
        );
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
    figure: PropTypes.exact({
        data: PropTypes.arrayOf(PropTypes.object),
        layout: PropTypes.object,
        frames: PropTypes.arrayOf(PropTypes.object),
    }),

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

PlotlyGraph.defaultProps = {
    ...privateDefaultProps,

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
