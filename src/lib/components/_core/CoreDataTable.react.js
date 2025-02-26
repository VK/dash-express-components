import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ResizeDetector from 'react-resize-detector';

/**
 * CoreDataTable wraps the DataTable of Dash and adds some select functions
 * to make it similar to a Dash Graph
 * 
 */
export default class CoreDataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_rows: [],
            virtualIndices: [],
            tableWidth: 500,
            tableHeight: 500,
            ...this.loadData(this.props.data, this.props.index),
        };

        this.tableResize = this.tableResize.bind(this);
        this.datatable_ref = React.createRef();
        this.clearTimeout = null;
    }




    loadData(indata, inindex = undefined) {

        // if indata is completely empty return emtpy data
        if (Object.keys(indata).length === 0) {
            return { data: [{"dummy": 1}], index: "dummy" };
        }

        const keys = Object.keys(indata);
        let index = keys[0];

        if (index && index !== undefined && keys.includes(inindex)) {
            index = inindex;
        }


        let data = indata[index].map((el, idx) => {
            let res = {};
            keys.forEach(k => res[k] = indata[k][idx]);

            return res;
        })

        return { data: data, index: index };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        if (this.props.data !== nextProps.data) {
            this.setState(this.loadData(
                nextProps.data,
                nextProps.index
            ));

            clearTimeout(this.setTimeout);
            let that = this;
            this.clearTimeout = setTimeout(function () {
                that.tableResize(that.state.tableWidth, that.state.tableHeight);
            }, 2000);
        }
    }


    clearTableSelect() {
        this.setState({
            selected_rows: []
        });

        this.props.setProps({
            selectedData: {
                points: []
            }
        });
    }


    selectAllFiltered() {

        this.setState({
            selected_rows: this.state.virtualIndices
        });

        this.props.setProps({
            selectedData:
            {
                points: this.state.virtualIndices.map(r => {
                    return {
                        ...this.state.data[r],
                        hovertext: this.state.data[r][this.state.index]
                    }
                })
            }
        });
    }

    componentDidMount() {

        let that = this;
        this.clearTimeout = setTimeout(function () {
            that.tableResize(that.state.tableWidth, that.state.tableHeight + 1);
        }, 2000);

    }

    componentWillUnmount() {
        if (this.clearTimeout) {
            clearTimeout(this.setTimeout);
        }
    }

    tableResize(w, h) {
        let that = this;

        setTimeout(function () {
            try {
                if (that.state.tableHeight !== h || that.state.tableWidth !== w) {
                    that.setState({ tableHeight: h, tableWidth: w });

                    const el = ReactDOM.findDOMNode(that.datatable_ref.current).children[1];

                    const parent = el.parentElement.parentElement;
                    
                    const parentHeight = parent.clientHeight;
                    const parentWidth = parent.clientWidth;

                    el.style["height"] = parentHeight + "px";
                    el.style["width"] = parentWidth + "px";
                    el.style["max-height"] = "unset";

                    const el2 = el.children[0].children[1].children[1];
                    el2.style["height"] = (parentHeight - 60) + "px";

                }
            } catch (error) {

            }
        }, 500);


    }


    render() {

        const DT = window.dash_table.DataTable;




        let props = {
            ...this.props,
            ...this.state
        }


        let clearable = this.state.selected_rows.length !== 0;
        let hasVirtualIndices = this.state.virtualIndices.length !== 0;



        return (
            <div style={{ width: "100%", height: "100%", position: "relative" }} >

                <DT {...props} ref={this.datatable_ref} setProps={el => {

                    if ("selected_rows" in el) {
                        this.setState({
                            selected_rows: el.selected_rows
                        })
                        this.props.setProps({
                            selectedData: {
                                points: el.selected_rows.map(r => {
                                    return {
                                        ...this.state.data[r],
                                        hovertext: this.state.data[r][this.state.index]
                                    }
                                })
                            }

                        });

                    } else {
                        this.props.setProps(el);
                    }

                    if ("derived_virtual_indices" in el) {
                        this.setState({
                            virtualIndices: el.derived_virtual_indices
                        })
                    }
                }
                } />


                <a style={{ position: "absolute", top: "1px", left: "1px", cursor: "pointer", zIndex: 301 }} onClick={event => {

                    import(/* webpackChunkName: "excel" */ 'exceljs').then(ExcelJS => {
                        const workbook = new ExcelJS.Workbook();
                        const sheet = workbook.addWorksheet('Data');

                        let cols = this.props.columns.map((el) => {
                            return {
                                header: el.name, id: el.id
                            }
                        });
                        sheet.columns = cols;

                        cols.forEach((c, idx) => {
                            sheet.getColumn(idx + 1).values = [c.header, ...this.props.data[c.id]];
                        });

                        var buff = workbook.xlsx.writeBuffer().then(function (data) {
                            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                            saveAs(blob, "data.xlsx");
                        });
                    });
                }

                } key={this.props.id + "-excel-button"}>
                    <svg version="1.1" x="0px" y="0px" viewBox="0 0 2289.75 2130" enableBackground="new 0 0 2289.75 2130" width="28px" height="29px">
                        <metadata>
                            <sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/">
                                <slices />
                                <sliceSourceBounds height="2130" width="2289.75" x="-1147.5" y="-1041" />
                            </sfw>
                        </metadata>
                        <path fill="#185C37" d="M1437.75,1011.75L532.5,852v1180.393c0,53.907,43.7,97.607,97.607,97.607l0,0h1562.036  c53.907,0,97.607-43.7,97.607-97.607l0,0V1597.5L1437.75,1011.75z" />
                        <path fill="#21A366" d="M1437.75,0H630.107C576.2,0,532.5,43.7,532.5,97.607c0,0,0,0,0,0V532.5l905.25,532.5L1917,1224.75  L2289.75,1065V532.5L1437.75,0z" />
                        <path fill="#107C41" d="M532.5,532.5h905.25V1065H532.5V532.5z" />
                        <path opacity="0.1" d="M1180.393,426H532.5v1331.25h647.893c53.834-0.175,97.432-43.773,97.607-97.607  V523.607C1277.825,469.773,1234.227,426.175,1180.393,426z" />
                        <path opacity="0.2" d="M1127.143,479.25H532.5V1810.5h594.643  c53.834-0.175,97.432-43.773,97.607-97.607V576.857C1224.575,523.023,1180.977,479.425,1127.143,479.25z" />
                        <path opacity="0.2" d="M1127.143,479.25H532.5V1704h594.643c53.834-0.175,97.432-43.773,97.607-97.607  V576.857C1224.575,523.023,1180.977,479.425,1127.143,479.25z" />
                        <path opacity="0.2" d="M1073.893,479.25H532.5V1704h541.393c53.834-0.175,97.432-43.773,97.607-97.607  V576.857C1171.325,523.023,1127.727,479.425,1073.893,479.25z" />
                        <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="203.5132" y1="1729.0183" x2="967.9868" y2="404.9817" gradientTransform="matrix(1 0 0 -1 0 2132)">
                            <stop offset="0" style={{ stopColor: '#18884F' }} />
                            <stop offset="0.5" style={{ stopColor: '#117E43' }} />
                            <stop offset="1" style={{ stopColor: '#0B6631' }} />
                        </linearGradient>
                        <path fill="url(#SVGID_1_)" d="M97.607,479.25h976.285c53.907,0,97.607,43.7,97.607,97.607v976.285  c0,53.907-43.7,97.607-97.607,97.607H97.607C43.7,1650.75,0,1607.05,0,1553.143V576.857C0,522.95,43.7,479.25,97.607,479.25z" />
                        <path fill="#FFFFFF" d="M302.3,1382.264l205.332-318.169L319.5,747.683h151.336l102.666,202.35  c9.479,19.223,15.975,33.494,19.49,42.919h1.331c6.745-15.336,13.845-30.228,21.3-44.677L725.371,747.79h138.929l-192.925,314.548  L869.2,1382.263H721.378L602.79,1160.158c-5.586-9.45-10.326-19.376-14.164-29.66h-1.757c-3.474,10.075-8.083,19.722-13.739,28.755  l-122.102,223.011H302.3z" />
                        <path fill="#33C481" d="M2192.143,0H1437.75v532.5h852V97.607C2289.75,43.7,2246.05,0,2192.143,0L2192.143,0z" />
                        <path fill="#107C41" d="M1437.75,1065h852v532.5h-852V1065z" />
                    </svg>
                </a>

                {clearable && <a style={{ position: "absolute", top: "32px", left: "4px", cursor: "pointer", zIndex: 301 }}
                    onClick={event => {
                        this.clearTableSelect();
                    }
                    } key={this.props.id + "-clear-button"}>
                    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enableBackground="new 0 0 512 512;" width="25px" height="25px" >
                        <path fill="#3B8BC0" d="M85.134,243.62l-63.395,63.395c-13.567,13.567-13.567,35.564,0,49.131l134.116,134.116
	c13.567,13.567,35.564,13.567,49.131,0l63.395-63.395L85.134,243.62z"/>
                        <path fill="#4EB9FF" d="M85.134,243.62c-13.567,13.567-13.567,35.564,0,49.131L219.25,426.867
	c13.567,13.567,35.564,13.567,49.131,0l110.941-110.941l-75.24-108.006l-108.006-75.24L85.134,243.62z"/>
                        <path fill="#FF4181" d="M490.262,155.854L356.146,21.738c-13.567-13.567-35.564-13.567-49.131,0L196.075,132.678
	l183.246,183.246l110.941-110.941C503.829,191.417,503.829,169.422,490.262,155.854z"/>
                        <path fill="#01121C" d="M498.454,147.662L364.339,13.546c-18.065-18.063-47.452-18.061-65.515,0L187.91,124.46
	c-0.009,0.009-0.019,0.019-0.027,0.027c-0.008,0.008-0.019,0.019-0.027,0.027L76.969,235.401c-0.009,0.009-0.019,0.019-0.027,0.027
	c-0.019,0.019-0.035,0.036-0.053,0.054l-63.343,63.342c-18.062,18.062-18.062,47.451,0,65.515l134.116,134.116
	c9.033,9.031,20.894,13.546,32.757,13.546s23.725-4.516,32.757-13.546l63.342-63.343c0.019-0.019,0.036-0.035,0.054-0.053
	c0.009-0.009,0.019-0.019,0.027-0.027l110.886-110.886c0.009-0.009,0.019-0.019,0.027-0.027c0.008-0.008,0.019-0.019,0.027-0.027
	l110.914-110.914C516.515,195.115,516.515,165.725,498.454,147.662z M260.189,418.674c-4.373,4.374-10.189,6.783-16.374,6.783
	c-6.185,0-11.999-2.408-16.374-6.783l-79.44-79.438c-4.525-4.523-11.858-4.523-16.384,0c-4.524,4.524-4.524,11.859,0,16.384
	l79.44,79.437c5.842,5.843,12.968,9.933,20.742,12.005l-35.008,35.008c-9.027,9.027-23.718,9.029-32.748,0L29.929,347.954
	c-9.028-9.029-9.028-23.72,0-32.748l35.008-35.008c2.073,7.774,6.162,14.9,12.004,20.742l21.909,21.91
	c4.525,4.522,11.858,4.524,16.384,0c4.524-4.524,4.524-11.859,0-16.384l-21.91-21.91c-4.373-4.373-6.782-10.189-6.782-16.374
	c0-6.185,2.408-11.999,6.783-16.374l102.748-102.748l166.865,166.865L260.189,418.674z M482.071,196.793L379.321,299.542
	L212.458,132.68L315.207,29.93c9.027-9.027,23.718-9.028,32.748,0l134.116,134.116C491.099,173.074,491.099,187.765,482.071,196.793
	z"/></svg>
                </a>}


                {!clearable && hasVirtualIndices && <a style={{ position: "absolute", top: "31px", left: "3px", cursor: "pointer", zIndex: 301 }}
                    onClick={event => {
                        this.selectAllFiltered();
                    }
                    } key={this.props.id + "-selectall-button"}>

                    <svg version="1.1" viewBox="0 0 22 22" width="26px" height="26px">
                        <g transform="translate(-347.64 -417.01)">
                            <path transform="matrix(.061114 0 0 .061114 336.74 401.83)" d="m534.29 429.51a177.14 177.14 0 1 1-354.29 0 177.14 177.14 0 1 1 354.29 0z" fill="#fff" fillRule="evenodd"></path>
                            <path transform="matrix(.053629 0 0 .053629 339.38 404.96)" d="m534.29 429.51a177.14 177.14 0 1 1-354.29 0 177.14 177.14 0 1 1 354.29 0z" fill="#0d6efd" fillRule="evenodd"></path>
                            <path d="m357.44 430.15-2.7858-2.7858-1.6646 1.7034 4.4044 4.5806 7.8246-8.1468-1.795-1.8411z" fill="#fff"></path>
                        </g>
                    </svg>
                </a>}


                <ResizeDetector
                    handleHeight={true}
                    handleWidth={true}
                    refreshMode="debounce"
                    refreshOptions={{ trailing: true }}
                    refreshRate={150}
                    onResize={(w, h) => this.tableResize(w, h)}
                />


            </div>
        );
    }
}




const defaultProps = {
    page_action: 'native',
    page_current: 0,
    page_size: 100,

    css: [],
    filter_query: '',
    filter_action: 'native',
    sort_as_null: [],
    sort_action: 'native',
    sort_mode: 'multi',
    sort_by: [],
    style_as_list_view: false,

    derived_viewport_data: [],
    derived_viewport_indices: [],
    derived_viewport_row_ids: [],
    derived_viewport_selected_rows: [],
    derived_viewport_selected_row_ids: [],
    derived_virtual_data: [],
    derived_virtual_indices: [],
    derived_virtual_row_ids: [],
    derived_virtual_selected_rows: [],
    derived_virtual_selected_row_ids: [],

    dropdown: {},
    dropdown_conditional: [],
    dropdown_data: [],

    fill_width: true,
    filter_options: {},
    fixed_columns: {
        headers: false,
        data: 0
    },
    fixed_rows: {
        headers: false,
        data: 0
    },

    markdown_options: {
        link_target: '_blank',
        html: false
    },

    tooltip: {},
    tooltip_conditional: [],
    tooltip_data: [],
    tooltip_header: {},
    tooltip_delay: 350,
    tooltip_duration: 2000,

    column_selectable: false,
    editable: false,
    export_columns: 'visible',
    export_format: 'none',
    include_headers_on_copy_paste: false,
    selected_cells: [],
    selected_columns: [],
    selectedData: {},
    selected_row_ids: [],
    cell_selectable: true,
    row_selectable: "multi",

    style_table: {},
    style_cell_conditional: [],
    style_data_conditional: [],
    style_filter_conditional: [],
    style_header_conditional: [],
    virtualization: false,

    persisted_props: [
        'columns.name',
        'filter_query',
        'hidden_columns',
        'selected_columns',
        'sort_by'
    ],
    persistence_type: 'local'
};

const propTypes = {
    /**
     * The contents of the table.
     * The keys of each item in data should match the column IDs.
     * Each item can also have an 'id' key, whose value is its row ID. If there
     * is a column with ID='id' this will display the row ID, otherwise it is
     * just used to reference the row for selections, filtering, etc.
     * Example:
     * [
     *      {'column-1': 4.5, 'column-2': 'montreal', 'column-3': 'canada'},
     *      {'column-1': 8, 'column-2': 'boston', 'column-3': 'america'}
     * ]
     */
    data: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.bool
            ])
        )
    ),

    index: PropTypes.string,

    /**
     * Columns describes various aspects about each individual column.
     * `name` and `id` are the only required parameters.
     */
    columns: PropTypes.arrayOf(
        PropTypes.exact({
            /**
             * The `id` of the column.
             * The column `id` is used to match cells in data with particular columns.
             * The `id` is not visible in the table.
             */
            id: PropTypes.string.isRequired,

            /**
             * The `name` of the column, as it appears in the column header.
             * If `name` is a list of strings, then the columns
             * will render with multiple headers rows.
             */
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.string)
            ]).isRequired,

            /**
             * The data-type provides support for per column typing and allows for data
             * validation and coercion.
             * 'numeric': represents both floats and ints.
             * 'text': represents a string.
             * 'datetime': a string representing a date or date-time, in the form:
             *   'YYYY-MM-DD HH:MM:SS.ssssss' or some truncation thereof. Years must
             *   have 4 digits, unless you use `validation.allow_YY: true`. Also
             *   accepts 'T' or 't' between date and time, and allows timezone info
             *   at the end. To convert these strings to Python `datetime` objects,
             *   use `dateutil.parser.isoparse`. In R use `parse_iso_8601` from the
             *   `parsedate` library.
             *   WARNING: these parsers do not work with 2-digit years, if you use
             *   `validation.allow_YY: true` and do not coerce to 4-digit years.
             *   And parsers that do work with 2-digit years may make a different
             *   guess about the century than we make on the front end.
             * 'any': represents any type of data.
             * Defaults to 'any' if undefined.
             *
             *
             */
            type: PropTypes.oneOf(['any', 'numeric', 'text', 'datetime']),

            /**
             * The `presentation` to use to display data. Markdown can be used on
             * columns with type 'text'.  See 'dropdown' for more info.
             * Defaults to 'input' for ['datetime', 'numeric', 'text', 'any'].
             */
            presentation: PropTypes.oneOf(['input', 'dropdown', 'markdown']),

            /**
             * If true, the user can select the column by clicking on the checkbox or radio button
             * in the column. If there are multiple header rows, true will display the input
             * on each row.
             * If `last`, the input will only appear on the last header row. If `first` it will only
             * appear on the first header row. These are respectively shortcut equivalents to
             * `[false, ..., false, true]` and `[true, false, ..., false]`.
             * If there are merged, multi-header columns then you can choose which column header
             * row to display the input in by supplying an array of booleans.
             * For example, `[true, false]` will display the `selectable` input on the first row,
             * but now on the second row.
             * If the `selectable` input appears on a merged columns, then clicking on that input
             * will select *all* of the merged columns associated with it.
             * The table-level prop `column_selectable` is used to determine the type of column
             * selection to use.
             *
             */
            selectable: PropTypes.oneOfType([
                PropTypes.oneOf(['first', 'last']),
                PropTypes.bool,
                PropTypes.arrayOf(PropTypes.bool)
            ]),

            /**
             * If true, the user can clear the column by clicking on the `clear`
             * action button on the column. If there are multiple header rows, true
             * will display the action button on each row.
             * If `last`, the `clear` action button will only appear on the last header
             * row. If `first` it will only appear on the first header row. These
             * are respectively shortcut equivalents to `[false, ..., false, true]` and
             * `[true, false, ..., false]`.
             * If there are merged, multi-header columns then you can choose
             * which column header row to display the `clear` action button in by
             * supplying an array of booleans.
             * For example, `[true, false]` will display the `clear` action button
             * on the first row, but not the second row.
             * If the `clear` action button appears on a merged column, then clicking
             * on that button will clear *all* of the merged columns associated with it.
             * Unlike `column.deletable`, this action does not remove the column(s)
             * from the table. It only removed the associated entries from `data`.
             */
            clearable: PropTypes.oneOfType([
                PropTypes.oneOf(['first', 'last']),
                PropTypes.bool,
                PropTypes.arrayOf(PropTypes.bool)
            ]),

            /**
             * If true, the user can remove the column by clicking on the `delete`
             * action button on the column. If there are multiple header rows, true
             * will display the action button on each row.
             * If `last`, the `delete` action button will only appear on the last header
             * row. If `first` it will only appear on the first header row. These
             * are respectively shortcut equivalents to `[false, ..., false, true]` and
             * `[true, false, ..., false]`.
             * If there are merged, multi-header columns then you can choose
             * which column header row to display the `delete` action button in by
             * supplying an array of booleans.
             * For example, `[true, false]` will display the `delete` action button
             * on the first row, but not the second row.
             * If the `delete` action button appears on a merged column, then clicking
             * on that button will remove *all* of the merged columns associated with it.
             */
            deletable: PropTypes.oneOfType([
                PropTypes.oneOf(['first', 'last']),
                PropTypes.bool,
                PropTypes.arrayOf(PropTypes.bool)
            ]),

            /**
             * There are two `editable` flags in the table.
             * This is the  column-level editable flag and there is
             * also the table-level `editable` flag.
             * These flags determine whether the contents of the table
             * are editable or not.
             * If the column-level `editable` flag is set it overrides
             * the table-level `editable` flag for that column.
             */
            editable: PropTypes.bool,

            /**
             * If true, the user can hide the column by clicking on the `hide`
             * action button on the column. If there are multiple header rows, true
             * will display the action button on each row.
             * If `last`, the `hide` action button will only appear on the last header
             * row. If `first` it will only appear on the first header row. These
             * are respectively shortcut equivalents to `[false, ..., false, true]` and
             * `[true, false, ..., false]`.
             * If there are merged, multi-header columns then you can choose
             * which column header row to display the `hide` action button in by
             * supplying an array of booleans.
             * For example, `[true, false]` will display the `hide` action button
             * on the first row, but not the second row.
             * If the `hide` action button appears on a merged column, then clicking
             * on that button will hide *all* of the merged columns associated with it.
             */
            hideable: PropTypes.oneOfType([
                PropTypes.oneOf(['first', 'last']),
                PropTypes.bool,
                PropTypes.arrayOf(PropTypes.bool)
            ]),

            /**
             * If true, the user can rename the column by clicking on the `rename`
             * action button on the column. If there are multiple header rows, true
             * will display the action button on each row.
             * If `last`, the `rename` action button will only appear on the last header
             * row. If `first` it will only appear on the first header row. These
             * are respectively shortcut equivalents to `[false, ..., false, true]` and
             * `[true, false, ..., false]`.
             * If there are merged, multi-header columns then you can choose
             * which column header row to display the `rename` action button in by
             * supplying an array of booleans.
             * For example, `[true, false]` will display the `rename` action button
             * on the first row, but not the second row.
             * If the `rename` action button appears on a merged column, then clicking
             * on that button will rename *all* of the merged columns associated with it.
             */
            renamable: PropTypes.oneOfType([
                PropTypes.oneOf(['first', 'last']),
                PropTypes.bool,
                PropTypes.arrayOf(PropTypes.bool)
            ]),

            /**
             * There are two `filter_options` props in the table.
             * This is the column-level filter_options prop and there is
             * also the table-level `filter_options` prop.
             * These props determine whether the applicable filter relational
             * operators will default to `sensitive` or `insensitive` comparison.
             * If the column-level `filter_options` prop is set it overrides
             * the table-level `filter_options` prop for that column.
             */
            filter_options: PropTypes.shape({
                case: PropTypes.oneOf(['sensitive', 'insensitive'])
            }),

            /**
             * The formatting applied to the column's data.
             * This prop is derived from the [d3-format](https://github.com/d3/d3-format) library specification. Apart from
             * being structured slightly differently (under a single prop), the usage is the same.
             * See also dash_table.FormatTemplate.  It contains helper functions for typical number formats.
             */
            format: PropTypes.exact({
                /**
                 * Represents localization specific formatting information.
                 * When left unspecified, will use the default value provided by d3-format.
                 */
                locale: PropTypes.exact({
                    /**
                     * (default: ['$', '']).  A list of two strings representing the
                     *  prefix and suffix symbols. Typically used for currency, and implemented using d3's
                     *  currency format, but you can use this for other symbols such as measurement units
                     */
                    symbol: PropTypes.arrayOf(PropTypes.string),
                    /**
                     * (default: '.').  The string used for the decimal separator
                     */
                    decimal: PropTypes.string,
                    /**
                     * (default: ',').  The string used for the groups separator
                     */
                    group: PropTypes.string,
                    /**
                     * (default: [3]).  A list of integers representing the grouping pattern. The default is
                     * 3 for thousands.
                     */
                    grouping: PropTypes.arrayOf(PropTypes.number),
                    /**
                     *  A list of ten strings used as replacements for numbers 0-9
                     */
                    numerals: PropTypes.arrayOf(PropTypes.string),
                    /**
                     * (default: '%').  The string used for the percentage symbol
                     */
                    percent: PropTypes.string,
                    /**
                     * (default: True). Separates integers with 4-digits or less
                     */
                    separate_4digits: PropTypes.bool
                }),
                /**
                 * A value that will be used in place of the nully value during formatting.
                 *   If the value type matches the column type, it will be formatted normally.
                 */
                nully: PropTypes.any,
                /**
                 * A number representing the SI unit to use during formatting.
                 *   See `dash_table.Format.Prefix` enumeration for the list of valid values
                 */
                prefix: PropTypes.number,
                /**
                 *  (default: '').  Represents the d3 rules to apply when formatting the number.
                 */
                specifier: PropTypes.string
            }),

            /**
             * The `on_change` behavior of the column for user-initiated modifications.
             */
            on_change: PropTypes.exact({
                /**
                 * (default 'coerce'):  'none': do not validate data;
                 *  'coerce': check if the data corresponds to the destination type and
                 *  attempts to coerce it into the destination type if not;
                 *  'validate': check if the data corresponds to the destination type (no coercion).
                 */
                action: PropTypes.oneOf(['coerce', 'none', 'validate']),
                /**
                 *  (default 'reject'):  What to do with the value if the action fails.
                 *  'accept': use the invalid value;
                 *  'default': replace the provided value with `validation.default`;
                 *  'reject': do not modify the existing value.
                 */
                failure: PropTypes.oneOf(['accept', 'default', 'reject'])
            }),

            /**
             * An array of string, number and boolean values that are treated as `null`
             * (i.e. ignored and always displayed last) when sorting.
             * This value overrides the table-level `sort_as_null`.
             */
            sort_as_null: PropTypes.arrayOf(
                PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                    PropTypes.bool
                ])
            ),

            /**
             * The `validation` options for user input processing that can accept, reject or apply a
             * default value.
             */
            validation: PropTypes.exact({
                /**
                 * Allow the use of nully values. (undefined, null, NaN) (default: False)
                 */
                allow_null: PropTypes.bool,
                /**
                 * The default value to apply with on_change.failure = 'default'. (default: None)
                 */
                default: PropTypes.any,
                /**
                 * This is for `datetime` columns only.  Allow 2-digit years (default: False).
                 *   If True, we interpret years as ranging from now-70 to now+29 - in 2019
                 *   this is 1949 to 2048 but in 2020 it will be different. If used with
                 *   `action: 'coerce'`, will convert user input to a 4-digit year.
                 */
                allow_YY: PropTypes.bool
            })
        })
    ),

    /**
     * If True, then the data in all of the cells is editable.
     * When `editable` is True, particular columns can be made
     * uneditable by setting `editable` to `False` inside the `columns`
     * property.
     * If False, then the data in all of the cells is uneditable.
     * When `editable` is False, particular columns can be made
     * editable by setting `editable` to `True` inside the `columns`
     * property.
     */
    editable: PropTypes.bool,

    /**
     * `fixed_columns` will "fix" the set of columns so that
     * they remain visible when scrolling horizontally across
     * the unfixed columns. `fixed_columns` fixes columns
     * from left-to-right.
     * If `headers` is False, no columns are fixed.
     * If `headers` is True, all operation columns (see `row_deletable` and `row_selectable`)
     * are fixed. Additional data columns can be fixed by
     * assigning a number to `data`.
     *
     * Note that fixing columns introduces some changes to the
     * underlying markup of the table and may impact the
     * way that your columns are rendered or sized.
     * View the documentation examples to learn more.
     *
     */
    fixed_columns: PropTypes.oneOfType([
        PropTypes.exact({
            /**
             * Example `{'headers':False, 'data':0}` No columns are fixed (the default)
             */

            data: PropTypes.oneOf([0]),
            headers: PropTypes.oneOf([false])
        }),

        PropTypes.exact({
            /**
             * Example `{'headers':True, 'data':1}` one column is fixed.
             */

            data: PropTypes.number,
            headers: PropTypes.oneOf([true]).isRequired
        })
    ]),

    /**
     * `fixed_rows` will "fix" the set of rows so that
     * they remain visible when scrolling vertically down
     * the table. `fixed_rows` fixes rows
     * from top-to-bottom, starting from the headers.
     * If `headers` is False, no rows are fixed.
     * If `headers` is True, all header and filter rows (see `filter_action`) are
     * fixed. Additional data rows can be fixed by assigning
     * a number to `data`.  Note that fixing rows introduces some changes to the
     * underlying markup of the table and may impact the
     * way that your columns are rendered or sized.
     * View the documentation examples to learn more.
     */
    fixed_rows: PropTypes.oneOfType([
        PropTypes.exact({
            /**
             * Example `{'headers':False, 'data':0}` No rows are fixed (the default)
             */

            data: PropTypes.oneOf([0]),
            headers: PropTypes.oneOf([false])
        }),
        PropTypes.exact({
            /**
             * Example `{'headers':True, 'data':1}` one row is fixed.
             */

            data: PropTypes.number,
            headers: PropTypes.oneOf([true]).isRequired
        })
    ]),

    /**
     * If `single`, then the user can select a single column or group
     * of merged columns via the radio button that will appear in the
     * header rows.
     * If `multi`, then the user can select multiple columns or groups
     * of merged columns via the checkbox that will appear in the header
     * rows.
     * If false, then the user will not be able to select columns and no
     * input will appear in the header rows.
     * When a column is selected, its id will be contained in `selected_columns`
     * and `derived_viewport_selected_columns`.
     */
    column_selectable: PropTypes.oneOf(['single', 'multi', false]),

    /**
     * If True (default), then it is possible to click and navigate
     * table cells.
     */
    cell_selectable: PropTypes.bool,

    /**
     * If `single`, then the user can select a single row
     * via a radio button that will appear next to each row.
     * If `multi`, then the user can select multiple rows
     * via a checkbox that will appear next to each row.
     * If false, then the user will not be able to select rows
     * and no additional UI elements will appear.
     * When a row is selected, its index will be contained
     * in `selected_rows`.
     */
    row_selectable: PropTypes.oneOf(['single', 'multi', false]),

    /**
     * If True, then a `x` will appear next to each `row`
     * and the user can delete the row.
     */
    row_deletable: PropTypes.bool,

    /**
     * The row and column indices and IDs of the currently active cell.
     * `row_id` is only returned if the data rows have an `id` key.
     */
    active_cell: PropTypes.exact({
        row: PropTypes.number,
        column: PropTypes.number,
        row_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        column_id: PropTypes.string
    }),

    /**
     * `selected_cells` represents the set of cells that are selected,
     * as an array of objects, each item similar to `active_cell`.
     * Multiple cells can be selected by holding down shift and
     * clicking on a different cell or holding down shift and navigating
     * with the arrow keys.
     */
    selected_cells: PropTypes.arrayOf(
        PropTypes.exact({
            row: PropTypes.number,
            column: PropTypes.number,
            row_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            column_id: PropTypes.string
        })
    ),

    /**
     * `selectedData` contains the selected data, like for a Graph
     */
    selectedData: PropTypes.any,

    /**
     * `selected_columns` contains the ids of columns that
     * are selected via the UI elements that appear when
     * `column_selectable` is `'single' or 'multi'`.
     */
    selected_columns: PropTypes.arrayOf(PropTypes.string),

    /**
     * `selected_row_ids` contains the ids of rows that
     * are selected via the UI elements that appear when
     * `row_selectable` is `'single'` or `'multi'`.
     */
    selected_row_ids: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * When selecting multiple cells
     * (via clicking on a cell and then shift-clicking on another cell),
     * `start_cell` represents the [row, column] coordinates of the cell
     * in one of the corners of the region.
     * `end_cell` represents the coordinates of the other corner.
     */
    start_cell: PropTypes.exact({
        row: PropTypes.number,
        column: PropTypes.number,
        row_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        column_id: PropTypes.string
    }),

    /**
     * When selecting multiple cells
     * (via clicking on a cell and then shift-clicking on another cell),
     * `end_cell` represents the row / column coordinates and IDs of the cell
     * in one of the corners of the region.
     * `start_cell` represents the coordinates of the other corner.
     */
    end_cell: PropTypes.exact({
        row: PropTypes.number,
        column: PropTypes.number,
        row_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        column_id: PropTypes.string
    }),

    /**
     * The previous state of `data`. `data_previous`
     * has the same structure as `data` and it will be updated
     * whenever `data` changes, either through a callback or
     * by editing the table.
     * This is a read-only property: setting this property will not
     * have any impact on the table.
     */
    data_previous: PropTypes.arrayOf(PropTypes.object),

    /**
     * List of columns ids of the columns that are currently hidden.
     * See the associated nested prop `columns.hideable`.
     */
    hidden_columns: PropTypes.arrayOf(PropTypes.string),

    /**
     * If True, then the `active_cell` is in a focused state.
     */
    is_focused: PropTypes.bool,

    /**
     * If True, then column headers that have neighbors with duplicate names
     * will be merged into a single cell.
     * This will be applied for single column headers and multi-column
     * headers.
     */
    merge_duplicate_headers: PropTypes.bool,

    /**
     * The unix timestamp when the data was last edited.
     * Use this property with other timestamp properties
     * (such as `n_clicks_timestamp` in `dash_html_components`)
     * to determine which property has changed within a callback.
     */
    data_timestamp: PropTypes.number,

    /**
     * If true, headers are included when copying from the table to different
     * tabs and elsewhere. Note that headers are ignored when copying from the table onto itself and
     * between two tables within the same tab.
     */
    include_headers_on_copy_paste: PropTypes.bool,

    /**
     * Denotes the columns that will be used in the export data file.
     * If `all`, all columns will be used (visible + hidden). If `visible`,
     * only the visible columns will be used. Defaults to `visible`.
     */
    export_columns: PropTypes.oneOf(['all', 'visible']),

    /**
     * Denotes the type of the export data file,
     * Defaults to `'none'`
     */
    export_format: PropTypes.oneOf(['csv', 'xlsx', 'none']),

    /**
     * Denotes the format of the headers in the export data file.
     * If `'none'`, there will be no header. If `'display'`, then the header
     * of the data file will be be how it is currently displayed. Note that
     * `'display'` is only supported for `'xlsx'` export_format and will behave
     * like `'names'` for `'csv'` export format. If `'ids'` or `'names'`,
     * then the headers of data file will be the column id or the column
     * names, respectively
     */
    export_headers: PropTypes.oneOf(['none', 'ids', 'names', 'display']),

    /**
     * `page_action` refers to a mode of the table where
     * not all of the rows are displayed at once: only a subset
     * are displayed (a "page") and the next subset of rows
     * can viewed by clicking "Next" or "Previous" buttons
     * at the bottom of the page.
     * Pagination is used to improve performance: instead of
     * rendering all of the rows at once (which can be expensive),
     * we only display a subset of them.
     * With pagination, we can either page through data that exists
     * in the table (e.g. page through `10,000` rows in `data` `100` rows at a time)
     * or we can update the data on-the-fly with callbacks
     * when the user clicks on the "Previous" or "Next" buttons.
     * These modes can be toggled with this `page_action` parameter:
     * `'native'`: all data is passed to the table up-front, paging logic is
     * handled by the table;
     * `'custom'`: data is passed to the table one page at a time, paging logic
     * is handled via callbacks;
     * `'none'`: disables paging, render all of the data at once.
     */
    page_action: PropTypes.oneOf(['custom', 'native', 'none']),

    /**
     * `page_current` represents which page the user is on.
     * Use this property to index through data in your callbacks with
     * backend paging.
     */
    page_current: PropTypes.number,

    /**
     * `page_count` represents the number of the pages in the
     * paginated table. This is really only useful when performing
     * backend pagination, since the front end is able to use the
     * full size of the table to calculate the number of pages.
     */
    page_count: PropTypes.number,

    /**
     * `page_size` represents the number of rows that will be
     * displayed on a particular page when `page_action` is `'custom'` or `'native'`
     */
    page_size: PropTypes.number,

    /**
     * If `filter_action` is enabled, then the current filtering
     * string is represented in this `filter_query`
     * property.
     */
    filter_query: PropTypes.string,

    /**
     * The `filter_action` property controls the behavior of the `filtering` UI.
     * If `'none'`, then the filtering UI is not displayed.
     * If `'native'`, then the filtering UI is displayed and the filtering
     * logic is handled by the table. That is, it is performed on the data
     * that exists in the `data` property.
     * If `'custom'`, then the filtering UI is displayed but it is the
     * responsibility of the developer to program the filtering
     * through a callback (where `filter_query` or `derived_filter_query_structure` would be the input
     * and `data` would be the output).
     */
    filter_action: PropTypes.oneOfType([
        PropTypes.oneOf(['custom', 'native', 'none']),
        PropTypes.shape({
            type: PropTypes.oneOf(['custom', 'native']).isRequired,
            operator: PropTypes.oneOf(['and', 'or'])
        })
    ]),

    /**
     * There are two `filter_options` props in the table.
     * This is the table-level filter_options prop and there is
     * also the column-level `filter_options` prop.
     * These props determine whether the applicable filter relational
     * operators will default to `sensitive` or `insensitive` comparison.
     * If the column-level `filter_options` prop is set it overrides
     * the table-level `filter_options` prop for that column.
     */
    filter_options: PropTypes.shape({
        case: PropTypes.oneOf(['sensitive', 'insensitive'])
    }),
    /**
     * The `sort_action` property enables data to be
     * sorted on a per-column basis.
     * If `'none'`, then the sorting UI is not displayed.
     * If `'native'`, then the sorting UI is displayed and the sorting
     * logic is handled by the table. That is, it is performed on the data
     * that exists in the `data` property.
     * If `'custom'`, the the sorting UI is displayed but it is the
     * responsibility of the developer to program the sorting
     * through a callback (where `sort_by` would be the input and `data`
     * would be the output).
     * Clicking on the sort arrows will update the
     * `sort_by` property.
     */
    sort_action: PropTypes.oneOf(['custom', 'native', 'none']),

    /**
     * Sorting can be performed across multiple columns
     * (e.g. sort by country, sort within each country,
     *  sort by year) or by a single column.
     * NOTE - With multi-column sort, it's currently
     * not possible to determine the order in which
     * the columns were sorted through the UI.
     * See [https://github.com/plotly/dash-table/issues/170](https://github.com/plotly/dash-table/issues/170)
     */
    sort_mode: PropTypes.oneOf(['single', 'multi']),

    /**
     * `sort_by` describes the current state
     * of the sorting UI.
     * That is, if the user clicked on the sort arrow
     * of a column, then this property will be updated
     * with the column ID and the direction
     * (`asc` or `desc`) of the sort.
     * For multi-column sorting, this will be a list of
     * sorting parameters, in the order in which they were
     * clicked.
     */
    sort_by: PropTypes.arrayOf(
        PropTypes.exact({
            column_id: PropTypes.string.isRequired,
            direction: PropTypes.oneOf(['asc', 'desc']).isRequired
        })
    ),

    /**
     * An array of string, number and boolean values that are treated as `None`
     * (i.e. ignored and always displayed last) when sorting.
     * This value will be used by columns without `sort_as_null`.
     * Defaults to `[]`.
     */
    sort_as_null: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool
        ])
    ),

    /**
     * `dropdown` specifies dropdown options for different columns.
     * Each entry refers to the column ID.
     * The `clearable` property defines whether the value can be deleted.
     * The `options` property refers to the `options` of the dropdown.
     */
    dropdown: PropTypes.objectOf(
        PropTypes.exact({
            clearable: PropTypes.bool,
            options: PropTypes.arrayOf(
                PropTypes.exact({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.oneOfType([
                        PropTypes.number,
                        PropTypes.string,
                        PropTypes.bool
                    ]).isRequired
                })
            ).isRequired
        })
    ),

    /**
     * `dropdown_conditional` specifies dropdown options in various columns and cells.
     * This property allows you to specify different dropdowns
     * depending on certain conditions. For example, you may
     * render different "city" dropdowns in a row depending on the
     * current value in the "state" column.
     */
    dropdown_conditional: PropTypes.arrayOf(
        PropTypes.exact({
            clearable: PropTypes.bool,
            if: PropTypes.exact({
                column_id: PropTypes.string,
                filter_query: PropTypes.string
            }),
            options: PropTypes.arrayOf(
                PropTypes.exact({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.oneOfType([
                        PropTypes.number,
                        PropTypes.string,
                        PropTypes.bool
                    ]).isRequired
                })
            ).isRequired
        })
    ),

    /**
     * `dropdown_data` specifies dropdown options on a row-by-row, column-by-column basis.
     * Each item in the array corresponds to the corresponding dropdowns for the `data` item
     * at the same index. Each entry in the item refers to the Column ID.
     */
    dropdown_data: PropTypes.arrayOf(
        PropTypes.objectOf(
            PropTypes.exact({
                clearable: PropTypes.bool,
                options: PropTypes.arrayOf(
                    PropTypes.exact({
                        label: PropTypes.string.isRequired,
                        value: PropTypes.oneOfType([
                            PropTypes.number,
                            PropTypes.string,
                            PropTypes.bool
                        ]).isRequired
                    })
                ).isRequired
            })
        )
    ),

    /**
     * `tooltip` is the column based tooltip configuration applied to all rows. The key is the column
     *  id and the value is a tooltip configuration.
     * Example: {i: {'value': i, 'use_with: 'both'} for i in df.columns}
     */
    tooltip: PropTypes.objectOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.exact({
                /**
                 * Represents the delay in milliseconds before
                 * the tooltip is shown when hovering a cell. This overrides
                 * the table's `tooltip_delay` property. If set to `None`,
                 * the tooltip will be shown immediately.
                 */
                delay: PropTypes.number,
                /**
                 * represents the duration in milliseconds
                 * during which the tooltip is shown when hovering a cell.
                 * This overrides the table's `tooltip_duration` property.
                 * If set to `None`, the tooltip will not disappear.
                 */
                duration: PropTypes.number,
                /**
                 * refers to the type of tooltip syntax used
                 * for the tooltip generation. Can either be `markdown`
                 * or `text`. Defaults to `text`.
                 */
                type: PropTypes.oneOf(['text', 'markdown']),
                /**
                 * Refers to whether the tooltip will be shown
                 * only on data or headers. Can be `both`, `data`, `header`.
                 * Defaults to `both`.
                 */
                use_with: PropTypes.oneOf(['both', 'data', 'header']),
                /**
                 * refers to the syntax-based content of
                 * the tooltip. This value is required. Alternatively, the value of the
                 * property can also be  a plain string. The `text` syntax will be used in
                 * that case.
                 */
                value: PropTypes.string.isRequired
            })
        ])
    ),

    /**
     * `tooltip_conditional` represents the tooltip shown
     * for different columns and cells.
     * This property allows you to specify different tooltips
     * depending on certain conditions. For example, you may have
     * different tooltips in the same column based on the value
     * of a certain data property.
     * Priority is from first to last defined conditional tooltip
     * in the list. Higher priority (more specific) conditional
     * tooltips should be put at the beginning of the list.
     */
    tooltip_conditional: PropTypes.arrayOf(
        PropTypes.exact({
            /**
             * The `delay` represents the delay in milliseconds before
             * the tooltip is shown when hovering a cell. This overrides
             * the table's `tooltip_delay` property. If set to `None`,
             * the tooltip will be shown immediately.
             */
            delay: PropTypes.number,
            /**
             * The `duration` represents the duration in milliseconds
             * during which the tooltip is shown when hovering a cell.
             * This overrides the table's `tooltip_duration` property.
             * If set to `None`, the tooltip will not disappear.
             */
            duration: PropTypes.number,

            /**
             * The `if` refers to the condition that needs to be fulfilled
             * in order for the associated tooltip configuration to be
             * used. If multiple conditions are defined, all conditions
             * must be met for the tooltip to be used by a cell.
             */

            if: PropTypes.exact({
                /**
                 * `column_id` refers to the column ID that must be matched.
                 */
                column_id: PropTypes.string,
                /**
                 * `filter_query` refers to the query that must evaluate to True.
                 */
                filter_query: PropTypes.string,
                /**
                 * `row_index` refers to the index of the row in the source `data`.
                 */
                row_index: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.oneOf(['odd', 'even'])
                ])
            }).isRequired,
            /**
             * The `type` refers to the type of tooltip syntax used
             * for the tooltip generation. Can either be `markdown`
             * or `text`. Defaults to `text`.
             */
            type: PropTypes.oneOf(['text', 'markdown']),
            /**
             * The `value` refers to the syntax-based content of the tooltip. This value is required.
             */
            value: PropTypes.string.isRequired
        })
    ),

    /**
     * `tooltip_data` represents the tooltip shown
     * for different columns and cells.
     * A list of dicts for which each key is
     * a column id and the value is a tooltip configuration.
     */
    tooltip_data: PropTypes.arrayOf(
        PropTypes.objectOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.exact({
                    /**
                     * The `delay` represents the delay in milliseconds before
                     * the tooltip is shown when hovering a cell. This overrides
                     * the table's `tooltip_delay` property. If set to `None`,
                     * the tooltip will be shown immediately.
                     */
                    delay: PropTypes.number,
                    /**
                     * The `duration` represents the duration in milliseconds
                     * during which the tooltip is shown when hovering a cell.
                     * This overrides the table's `tooltip_duration` property.
                     * If set to `None`, the tooltip will not disappear.
                     * Alternatively, the value of the property can also be
                     * a plain string. The `text` syntax will be used in
                     * that case.
                     */
                    duration: PropTypes.number,
                    /**
                     * For each tooltip configuration,
                     * The `type` refers to the type of tooltip syntax used
                     * for the tooltip generation. Can either be `markdown`
                     * or `text`. Defaults to `text`.
                     */
                    type: PropTypes.oneOf(['text', 'markdown']),
                    /**
                     * The `value` refers to the syntax-based content of the tooltip. This value is required.
                     */
                    value: PropTypes.string.isRequired
                })
            ])
        )
    ),

    /**
     * `tooltip_header` represents the tooltip shown
     * for each header column and optionally each header row.
     * Example to show long column names in a tooltip: {i: i for i in df.columns}.
     * Example to show different column names in a tooltip: {'Rep': 'Republican', 'Dem': 'Democrat'}.
     * If the table has multiple rows of headers, then use a list as the value of the
     * `tooltip_header` items.
     *
     *
     */
    tooltip_header: PropTypes.objectOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.exact({
                /**
                 * The `delay` represents the delay in milliseconds before
                 * the tooltip is shown when hovering a cell. This overrides
                 * the table's `tooltip_delay` property. If set to `None`,
                 * the tooltip will be shown immediately.
                 */
                delay: PropTypes.number,
                /**
                 * The `duration` represents the duration in milliseconds
                 * during which the tooltip is shown when hovering a cell.
                 * This overrides the table's `tooltip_duration` property.
                 * If set to `None`, the tooltip will not disappear.
                 * Alternatively, the value of the property can also be
                 * a plain string. The `text` syntax will be used in
                 * that case.
                 */
                duration: PropTypes.number,
                /**
                 * For each tooltip configuration,
                 * The `type` refers to the type of tooltip syntax used
                 * for the tooltip generation. Can either be `markdown`
                 * or `text`. Defaults to `text`.
                 */
                type: PropTypes.oneOf(['text', 'markdown']),
                /**
                 * The `value` refers to the syntax-based content of the tooltip. This value is required.
                 */
                value: PropTypes.string.isRequired
            }),
            PropTypes.arrayOf(
                PropTypes.oneOfType([
                    PropTypes.oneOf([null]),
                    PropTypes.string,
                    PropTypes.exact({
                        delay: PropTypes.number,
                        duration: PropTypes.number,
                        type: PropTypes.oneOf(['text', 'markdown']),
                        value: PropTypes.string.isRequired
                    })
                ])
            )
        ])
    ),

    /**
     * `tooltip_delay` represents the table-wide delay in milliseconds before
     * the tooltip is shown when hovering a cell. If set to `None`, the tooltip
     * will be shown immediately.
     * Defaults to 350.
     */
    tooltip_delay: PropTypes.number,

    /**
     * `tooltip_duration` represents the table-wide duration in milliseconds
     * during which the tooltip will be displayed when hovering a cell. If
     * set to `None`, the tooltip will not disappear.
     * Defaults to 2000.
     */
    tooltip_duration: PropTypes.number,

    /**
     * The localization specific formatting information applied to all columns in the table.
     * This prop is derived from the [d3.formatLocale](https://github.com/d3/d3-format#formatLocale) data structure specification.
     * When left unspecified, each individual nested prop will default to a pre-determined value.
     */
    locale_format: PropTypes.exact({
        /**
         *   (default: ['$', '']). A  list of two strings representing the
         *   prefix and suffix symbols. Typically used for currency, and implemented using d3's
         *   currency format, but you can use this for other symbols such as measurement units.
         */
        symbol: PropTypes.arrayOf(PropTypes.string),
        /**
         * (default: '.'). The string used for the decimal separator.
         */
        decimal: PropTypes.string,
        /**
         * (default: ','). The string used for the groups separator.
         */
        group: PropTypes.string,
        /**
         * (default: [3]). A  list of integers representing the grouping pattern.
         */
        grouping: PropTypes.arrayOf(PropTypes.number),
        /**
         * A list of ten strings used as replacements for numbers 0-9.
         */
        numerals: PropTypes.arrayOf(PropTypes.string),
        /**
         * (default: '%'). The string used for the percentage symbol.
         */
        percent: PropTypes.string,
        /**
         * (default: True). Separate integers with 4-digits or less.
         */
        separate_4digits: PropTypes.bool
    }),

    /**
     * If True, then the table will be styled like a list view
     * and not have borders between the columns.
     */
    style_as_list_view: PropTypes.bool,

    /**
     * `fill_width` toggles between a set of CSS for two common behaviors:
     * True: The table container's width will grow to fill the available space;
     * False: The table container's width will equal the width of its content.
     */
    fill_width: PropTypes.bool,

    /**
     * The `markdown_options` property allows customization of the markdown cells behavior.
     */
    markdown_options: PropTypes.exact({
        /**
         * (default: '_blank').  The link's behavior (_blank opens the link in a
         * new tab, _parent opens the link in the parent frame, _self opens the link in the
         * current tab, and _top opens the link in the top frame) or a string
         */
        link_target: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.oneOf(['_blank', '_parent', '_self', '_top'])
        ]),
        /**
         * (default: False)  If True, html may be used in markdown cells
         * Be careful enabling html if the content being rendered can come
         * from an untrusted user, as this may create an XSS vulnerability.
         */
        html: PropTypes.bool
    }),

    /**
     * The `css` property is a way to embed CSS selectors and rules
     * onto the page.
     * We recommend starting with the `style_*` properties
     * before using this `css` property.
     * Example:
     * [
     *     {"selector": ".dash-spreadsheet", "rule": 'font-family: "monospace"'}
     * ]
     */
    css: PropTypes.arrayOf(
        PropTypes.exact({
            selector: PropTypes.string.isRequired,
            rule: PropTypes.string.isRequired
        })
    ),

    /**
     * CSS styles to be applied to the outer `table` container.
     * This is commonly used for setting properties like the
     * width or the height of the table.
     */
    style_table: PropTypes.object,

    /**
     * CSS styles to be applied to each individual cell of the table.
     * This includes the header cells, the `data` cells, and the filter
     * cells.
     */
    style_cell: PropTypes.object,

    /**
     * CSS styles to be applied to each individual data cell.
     * That is, unlike `style_cell`, it excludes the header and filter cells.
     */
    style_data: PropTypes.object,

    /**
     * CSS styles to be applied to the filter cells.
     * Note that this may change in the future as we build out a
     * more complex filtering UI.
     */
    style_filter: PropTypes.object,

    /**
     * CSS styles to be applied to each individual header cell.
     * That is, unlike `style_cell`, it excludes the `data` and filter cells.
     */
    style_header: PropTypes.object,

    /**
     * Conditional CSS styles for the cells.
     * This can be used to apply styles to cells on a per-column basis.
     */
    style_cell_conditional: PropTypes.arrayOf(
        PropTypes.shape({
            if: PropTypes.exact({
                column_id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.arrayOf(PropTypes.string)
                ]),
                column_type: PropTypes.oneOf([
                    'any',
                    'numeric',
                    'text',
                    'datetime'
                ])
            })
        })
    ),

    /**
     * Conditional CSS styles for the data cells.
     * This can be used to apply styles to data cells on a per-column basis.
     */
    style_data_conditional: PropTypes.arrayOf(
        PropTypes.shape({
            if: PropTypes.exact({
                column_id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.arrayOf(PropTypes.string)
                ]),
                column_type: PropTypes.oneOf([
                    'any',
                    'numeric',
                    'text',
                    'datetime'
                ]),
                filter_query: PropTypes.string,
                state: PropTypes.oneOf(['active', 'selected']),
                row_index: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.oneOf(['odd', 'even']),
                    PropTypes.arrayOf(PropTypes.number)
                ]),
                column_editable: PropTypes.bool
            })
        })
    ),

    /**
     * Conditional CSS styles for the filter cells.
     * This can be used to apply styles to filter cells on a per-column basis.
     */
    style_filter_conditional: PropTypes.arrayOf(
        PropTypes.shape({
            if: PropTypes.exact({
                column_id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.arrayOf(PropTypes.string)
                ]),
                column_type: PropTypes.oneOf([
                    'any',
                    'numeric',
                    'text',
                    'datetime'
                ]),
                column_editable: PropTypes.bool
            })
        })
    ),

    /**
     * Conditional CSS styles for the header cells.
     * This can be used to apply styles to header cells on a per-column basis.
     */
    style_header_conditional: PropTypes.arrayOf(
        PropTypes.shape({
            if: PropTypes.exact({
                column_id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.arrayOf(PropTypes.string)
                ]),
                column_type: PropTypes.oneOf([
                    'any',
                    'numeric',
                    'text',
                    'datetime'
                ]),
                header_index: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.arrayOf(PropTypes.number),
                    PropTypes.oneOf(['odd', 'even'])
                ]),
                column_editable: PropTypes.bool
            })
        })
    ),

    /**
     * This property tells the table to use virtualization when rendering.
     * Assumptions are that:
     * the width of the columns is fixed;
     * the height of the rows is always the same; and
     * runtime styling changes will not affect width and height vs. first rendering
     */
    virtualization: PropTypes.bool,

    /**
     * This property represents the current structure of
     * `filter_query` as a tree structure. Each node of the
     * query structure has:
     * type (string; required):
     *   'open-block',
     *   'logical-operator',
     *   'relational-operator',
     *   'unary-operator', or
     *   'expression';
     * subType (string; optional):
     *   'open-block': '()',
     *   'logical-operator': '&&', '||',
     *   'relational-operator': '=', '>=', '>', '<=', '<', '!=', 'contains',
     *   'unary-operator': '!', 'is bool', 'is even', 'is nil', 'is num', 'is object', 'is odd', 'is prime', 'is str',
     *   'expression': 'value', 'field';
     * value (any):
     *   'expression, value': passed value,
     *   'expression, field': the field/prop name.
     * block (nested query structure; optional).
     * left (nested query structure; optional).
     * right (nested query structure; optional).
     * If the query is invalid or empty, the `derived_filter_query_structure` will
     * be `None`.
     */
    derived_filter_query_structure: PropTypes.object,

    /**
     * This property represents the current state of `data`
     * on the current page. This property will be updated
     * on paging, sorting, and filtering.
     */
    derived_viewport_data: PropTypes.arrayOf(PropTypes.object),

    /**
     * `derived_viewport_indices` indicates the order in which the original
     * rows appear after being filtered, sorted, and/or paged.
     * `derived_viewport_indices` contains indices for the current page,
     * while `derived_virtual_indices` contains indices across all pages.
     */
    derived_viewport_indices: PropTypes.arrayOf(PropTypes.number),

    /**
     * `derived_viewport_row_ids` lists row IDs in the order they appear
     * after being filtered, sorted, and/or paged.
     * `derived_viewport_row_ids` contains IDs for the current page,
     * while `derived_virtual_row_ids` contains IDs across all pages.
     */
    derived_viewport_row_ids: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * `derived_viewport_selected_columns` contains the ids of the
     * `selected_columns` that are not currently hidden.
     */
    derived_viewport_selected_columns: PropTypes.arrayOf(PropTypes.string),

    /**
     * `derived_viewport_selected_rows` represents the indices of the
     * `selected_rows` from the perspective of the `derived_viewport_indices`.
     */
    derived_viewport_selected_rows: PropTypes.arrayOf(PropTypes.number),

    /**
     * `derived_viewport_selected_row_ids` represents the IDs of the
     * `selected_rows` on the currently visible page.
     */
    derived_viewport_selected_row_ids: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * This property represents the visible state of `data`
     * across all pages after the front-end sorting and filtering
     * as been applied.
     */
    derived_virtual_data: PropTypes.arrayOf(PropTypes.object),

    /**
     * `derived_virtual_indices` indicates the order in which the original
     * rows appear after being filtered and sorted.
     * `derived_viewport_indices` contains indices for the current page,
     * while `derived_virtual_indices` contains indices across all pages.
     */
    derived_virtual_indices: PropTypes.arrayOf(PropTypes.number),

    /**
     * `derived_virtual_row_ids` indicates the row IDs in the order in which
     * they appear after being filtered and sorted.
     * `derived_viewport_row_ids` contains IDs for the current page,
     * while `derived_virtual_row_ids` contains IDs across all pages.
     */
    derived_virtual_row_ids: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * `derived_virtual_selected_rows` represents the indices of the
     *  `selected_rows` from the perspective of the `derived_virtual_indices`.
     */
    derived_virtual_selected_rows: PropTypes.arrayOf(PropTypes.number),

    /**
     * `derived_virtual_selected_row_ids` represents the IDs of the
     * `selected_rows` as they appear after filtering and sorting,
     * across all pages.
     */
    derived_virtual_selected_row_ids: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    /**
     * The ID of the table.
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that gets fired when the user makes changes.
     */
    setProps: PropTypes.func,

    // /**
    //  * Object that holds the loading state object coming from dash-renderer
    //  */
    // loading_state: PropTypes.shape({
    //     /**
    //      * Determines if the component is loading or not
    //      */
    //     is_loading: PropTypes.bool,
    //     /**
    //      * Holds which property is loading
    //      */
    //     prop_name: PropTypes.string,
    //     /**
    //      * Holds the name of the component that is loading
    //      */
    //     component_name: PropTypes.string
    // }),

    /**
     * Used to allow user interactions in this component to be persisted when
     * the component - or the page - is refreshed. If `persisted` is truthy and
     * hasn't changed from its previous value, any `persisted_props` that the
     * user has changed while using the app will keep those changes, as long as
     * the new prop value also matches what was given originally.
     * Used in conjunction with `persistence_type` and `persisted_props`.
     */
    persistence: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number
    ]),

    /**
     * Properties whose user interactions will persist after refreshing the
     * component or the page.
     */
    persisted_props: PropTypes.arrayOf(
        PropTypes.oneOf([
            'columns.name',
            'data',
            'filter_query',
            'hidden_columns',
            'page_current',
            'selected_columns',
            'selected_rows',
            'sort_by'
        ])
    ),

    /**
     * Where persisted user changes will be stored:
     * memory: only kept in memory, reset on page refresh.
     * local: window.localStorage, data is kept after the browser quit.
     * session: window.sessionStorage, data is cleared once the browser quit.
     */
    persistence_type: PropTypes.oneOf(['local', 'session', 'memory']),

};

CoreDataTable.persistenceTransforms = {
    columns: {
        name: {
            extract: propValue => R.pluck('name', propValue),
            apply: (storedValue, propValue) =>
                R.zipWith(R.assoc('name'), storedValue, propValue)
        }
    }
};

CoreDataTable.defaultProps = defaultProps;
CoreDataTable.propTypes = propTypes;