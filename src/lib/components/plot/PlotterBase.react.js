import { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { singleColorStyle, multiColorStyle } from '../sub/Base.react';


export default class PlotterBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            allColOptions: props.allColOptions,
            numColOptions: props.numColOptions,
            catColOptions: props.catColOptions,

        };




        this.marginal_options = [
            { label: 'Histogram', value: 'histogram' },
            { label: 'Box', value: 'box' },
            { label: 'Violin', value: 'violin' },
            { label: 'Samples', value: 'rug' }
        ];

        this.facet_col_wrap_options = [
            { label: 'no wrap', value: undefined },
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
            { label: '6', value: 6 },
            { label: '7', value: 7 },
            { label: '8', value: 8 },
            { label: '9', value: 9 },
            { label: '10', value: 10 }
        ];


        this.option_dict = {
            error: {
                id: "error", label: "Errorbars", visible: false, reset: {
                    error_x: [], error_y: [],
                    error_x_minus: [], error_y_minus: []
                }
            },
            marginal: { id: "marginal", label: "Sideplots", visible: false, reset: { marginal_x: [], marginal_y: [] } },
            facet: {
                id: "facet", label: "Subplots", visible: false, reset: {
                    facet_col: [], facet_row: [], facet_col_wrap: [],
                    indep_x: null, indep_y: null
                }
            },
            labels: { id: "labels", label: "Labels", visible: false, reset: { hover_name: [], hover_data: [], title: null } },
            axis: {
                id: "axis", label: "Axis", visible: false, reset: {
                    log_x: null, log_y: null,
                    cat_x: null, cat_y: null,
                    range_x: [], range_y: [], __range_x_min: null, __range_x_max: null, __range_y_min: null, __range_y_max: null,
                }
            },
            axis_nocat: {
                id: "axisNoCat", label: "Axis", visible: false, reset: {
                    log_x: null, log_y: null,
                    range_x: [], range_y: [], __range_x_min: null, __range_x_max: null, __range_y_min: null, __range_y_max: null,
                }
            },


        }

    }

    copy_params(typename) {
        this.typename = typename;
        
        if ("params" in this.props.config && typename === this.props.config.type) {
            this.state = {
                ...this.state,
                ...this.props.config.params
            };
        }
    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path></svg>)
    static label = "Empty plot";
    static type = "base";


    /*
    if some options are enabled and need additional views, we enable this here
    needs to be called by the contructior if config comes from props, or on change
    */
    init_check_options(constructor = false) {
        let { optionsbar } = this.state;



        let new_bar = [];
        optionsbar.forEach(el => {


            let tests = Object.keys(el.reset).map(k => k in this.state && (
                (!Array.isArray(this.state[k]) && this.state[k] !== undefined && this.state[k] != null) ||
                (Array.isArray(this.state[k]) && this.state[k].length > 0)));

            if (tests.some(e => e)) {
                new_bar.push({ ...el, visible: true });
            } else {
                new_bar.push(el);
            }
        })

        if (constructor) {
            this.state = { ...this.state, optionsbar: new_bar };
        } else {
            this.setState({ optionsbar: new_bar });
        }
    }


    base_config_from_state() {

        return {

            x: this.state.x,
            y: this.state.y,
            dimensions: this.state.dimensions,
            color: this.state.color,
            symbol: this.state.symbol,
            size: this.state.size,

            boxmode: this.state.boxmode,
            points: this.state.points,

            error_x: this.state.error_x,
            error_y: this.state.error_y,
            error_x_minus: this.state.error_x_minus,
            error_y_minus: this.state.error_y_minus,

            marginal_x: this.state.marginal_x,
            marginal_y: this.state.marginal_y,


            trendline: this.state.trendline,

            facet_col: this.state.facet_col,
            facet_row: this.state.facet_row,
            facet_col_wrap: this.state.facet_col_wrap,
            indep_x: this.state.indep_x,
            indep_y: this.state.indep_y,


            log_x: this.state.log_x,
            log_y: this.state.log_y,
            cat_x: this.state.cat_x,
            cat_y: this.state.cat_y,
            range_x: this.state.range_x,
            range_y: this.state.range_y,

            title: this.state.title,
            hover_name: this.state.hover_name,
            hover_data: this.state.hover_data,


            histnorm: this.state.histnorm,
            cumulative: this.state.cumulative,
            nbins: this.state.nbins,


            trendline: this.state.trendline,
        }

    }


    /*
    helper to strip the data sent back to plotly express
    here, we transform all arrays with only one element to a a string
    and the empty arrays are removed!
    */
    preferSimple(o) {
        let no = { ...o };

        Object.keys(o).filter(k => !["hover_data", "range_x", "range_y", "dimensions"].includes(k)).forEach(k => {
            if (Array.isArray(o[k])) {
                if (o[k].length === 0) {
                    delete no[k];
                } else if (o[k].length === 1) {
                    no[k] = no[k][0];
                }
            } else {
                if (o[k] === undefined || o[k] === null) {
                    delete no[k];
                }
            }
        });

        Object.keys(o).filter(k => ["hover_data", "range_x", "range_y", "dimensions"].includes(k)).forEach(k => {
            if (Array.isArray(o[k])) {
                if (o[k].length === 0) {
                    delete no[k];
                } else if (o[k].some(ele => ele === undefined || ele === null || (typeof ele === "number" && isNaN(ele)))) {
                    delete no[k];
                }
            } else {
                delete no[k];
            }
        });

        Object.keys(no).filter(k => k.startsWith("__")).forEach(k => {
            delete no[k];
        });

        return no;
    }

    setStateConfig(input) {

        let cfg = this.config_from_state(input);

        this.setState({
            ...input,
            config: cfg
        }, e => {
            this.props.setProps(
                { config: cfg }
            )
        });

    }

    config_from_state(input) {
        return {
            type: "scatter"
        }
    }


    /**
     * external parameters change
     */
    UNSAFE_componentWillReceiveProps(newProps) {


        if (newProps.config !== this.props.config
            ||
            newProps.config.params !== this.props.config.params

        ) {

            // only make something if the plot type matches
            if (this.typename === newProps.config.type) {
                //first copy the new config
                this.setState(
                    { config: newProps.config },
                    () => {

                        // then make a local copy of the parameters
                        if ("params" in newProps.config) {
                            this.setState({
                                ...newProps.config.params
                            }, () => {
                                // then compute the visibility of the options
                                this.init_check_options();
                            })
                        }
                    });
            }

        }


        if (newProps.allColOptions !== this.props.allColOptions) {
            this.setState(
                { allColOptions: newProps.allColOptions }
            )
        }
        if (newProps.numColOptions !== this.props.numColOptions) {
            this.setState(
                { numColOptions: newProps.numColOptions }
            )
        }
        if (newProps.catColOptions !== this.props.catColOptions) {
            this.setState(
                { catColOptions: newProps.catColOptions }
            )
        }

    }

    render() {
        return (
            <div>
                Put you  plot config GUI here
            </div>
        );
    }


    multiSelect(name, varname, options) {

        let v = (varname in this.state) ? this.state[varname] : [];
        if (!Array.isArray(v)) {
            v = [v];
        }

        return (<InputGroup className="mb-1 w-100">
            <InputGroup.Text className="d-flex flex-grow-1" style={{ "minWidth": 75 }}>{name}</InputGroup.Text>
            <div style={{ "flexGrow": 10000 }}>
                <Select
                    options={options}
                    value={options.filter(el => v.includes(el.value))}
                    onChange={selectedOption => { this.setStateConfig({ [varname]: selectedOption.map(el => el.value) }); }}
                    isMulti
                    styles={multiColorStyle}
                /></div>
        </InputGroup>)
    }

    singleSelect(name, varname, options) {

        const v = (varname in this.state) ? this.state[varname] : [];

        return (<InputGroup className="mb-1 w-100">
            <InputGroup.Text className="d-flex flex-grow-1" style={{ "minWidth": 75 }}>{name}</InputGroup.Text>
            <div style={{ "flexGrow": 10000 }}>
                <Select
                    options={options}
                    value={(v) ? options.filter(el => v === el.value) : undefined}
                    onChange={selectedOption => {
                        if (selectedOption) {
                            this.setStateConfig({ [varname]: selectedOption.value });
                        } else {
                            this.setStateConfig({ [varname]: undefined });
                        }
                    }}
                    isClearable
                    styles={singleColorStyle}
                /></div>
        </InputGroup>)
    }


    singleSelect_ExtraOption(name, varname, options) {

        const v = (varname in this.state) ? this.state[varname] : [];

        return (<InputGroup className="mb-1 w-100">
            <InputGroup.Text className="d-flex flex-grow-1" style={{ "minWidth": 75 }}>{name}</InputGroup.Text>
            <div style={{ "flexGrow": 10000 }}>
                <Select
                    options={options}
                    value={(v) ? options.filter(el => v === el.value) : undefined}
                    onChange={selectedOption => {
                        if (selectedOption) {
                            this.setStateConfig({ [varname]: selectedOption.value });
                        } else {
                            this.setStateConfig({ [varname]: undefined });
                        }
                    }}
                    isClearable
                /></div>
        </InputGroup>)
    }


    range_ManualInputArray(name, varname, option_varnames) {


        const o = option_varnames.map(el => (el in this.state) ? this.state[el] : null);
        const v = option_varnames.map((el, idx) => o[idx]);

        return (<InputGroup className="mb-1 w-100">
            <InputGroup.Text className="d-flex flex-grow-1" style={{ "maxWidth": 75 }}>{name}</InputGroup.Text>

            {
                option_varnames.map((el, idx) => {

                    return <FormControl type="number" value={o[idx]} size='sm' onChange={e => {
                        try {
                            v[idx] = Number.parseFloat(e.target.value);
                            if (isNaN(v[idx])) {
                                v[idx] = null;
                            }
                        } catch {
                            v[idx] = null;
                        };
                        let new_config = {
                            [el]: v[idx]
                        }
                        if (o.every(e => Number.isFinite(e))) {
                            new_config[varname] = v
                        }

                        this.setStateConfig(new_config);
                    }
                    }

                    />
                })
            }

        </InputGroup>)
    }


    range_ManualString(name, varname) {

        const v = (varname in this.state) ? this.state[varname] : "";

        return (<InputGroup className="mb-1 w-100">
            <InputGroup.Text className="d-flex flex-grow-1" style={{ "maxWidth": 75 }}>{name}</InputGroup.Text>
            <FormControl value={v} size='sm' onChange={e => {
                if (varname === "titleadfasdfasdfs") {
                    this.setState({ [varname]: e.target.value });
                } else {
                    this.setStateConfig({ [varname]: e.target.value });
                }
            }} />
        </InputGroup>)
    }


    toggleSelect(name, varname, options) {

        const v = (varname in this.state) ? this.state[varname] : options[0];

        return <ToggleButton
            id={"toggle-" + varname}
            type="checkbox"
            variant="outline-primary"
            checked={v}
            onChange={(e) => {
                let new_state = (v === options[0]) ? options[1] : options[0];
                this.setStateConfig({ [varname]: new_state });
            }}
            size='sm'
        >{name}</ToggleButton>
    }


    toggle_single(bar_option) {
        if (bar_option.visible && "reset" in bar_option) {
            this.setStateConfig(bar_option.reset);
        }

        return { ...bar_option, visible: !bar_option.visible }
    }

    toggle_optionsbar(id) {
        const { optionsbar } = this.state;
        let new_state = optionsbar.map(el => (el.id == id) ? this.toggle_single(el) : el);
        this.setState({ optionsbar: new_state });
    }


    optionsBar() {
        const { optionsbar } = this.state;

        return <ButtonGroup aria-label="options-bar" id="options-bar" className="w-100 mt-3 mb-2">
            {
                optionsbar.map(el => {
                    return <ToggleButton
                        id={"toggle-" + el.id}
                        type="checkbox"
                        variant="outline-primary"
                        checked={el.visible}
                        onChange={(e) => this.toggle_optionsbar(el.id)}
                        size='sm'
                    >{el.label}</ToggleButton>
                })
            }
        </ButtonGroup>
    }


    commonOptionBarControlls() {
        const {
            optionsbar,
            allColOptions,
            catColOptions,
            numColOptions
        } = this.state;

        return <div>
            {
                optionsbar.filter(el => el.visible).map(el => {

                    if (el.id === "error") {
                        return <div>
                            <h5>{el.label}</h5>
                            {this.multiSelect("X", "error_x", numColOptions)}
                            {this.multiSelect("Y", "error_y", numColOptions)}
                            {this.multiSelect("X-", "error_x_minus", numColOptions)}
                            {this.multiSelect("Y-", "error_y_minus", numColOptions)}
                        </div>
                    }

                    if (el.id === "marginal") {
                        return <div>
                            <h5>{el.label}</h5>
                            {this.singleSelect_ExtraOption("X", "marginal_x", this.marginal_options)}
                            {this.singleSelect_ExtraOption("Y", "marginal_y", this.marginal_options)}
                        </div>
                    }

                    if (el.id === "facet") {
                        return <div>
                            <h5>{el.label}</h5>
                            {this.singleSelect("Cols", "facet_col", catColOptions)}
                            {this.singleSelect("Rows", "facet_row", catColOptions)}
                            {this.singleSelect_ExtraOption("Wrap", "facet_col_wrap", this.facet_col_wrap_options)}

                            <ButtonGroup aria-label="independent-bar" id="options-indep-axis" className="w-100 mb-1">
                                {this.toggleSelect("Independent x", "indep_x", [null, true])}
                                {this.toggleSelect("Independent y", "indep_y", [null, true])}
                            </ButtonGroup>
                            {/* facet_col_wrap = 1, 2, 3, 4, , indep_x = True, indep_x = True */}
                        </div>
                    }


                    if (el.id === "axis") {
                        return <div>
                            <h5>{el.label}</h5>

                            {this.range_ManualInputArray("Range x", "range_x", ["__range_x_min", "__range_x_max"])}
                            {this.range_ManualInputArray("Range y", "range_y", ["__range_y_min", "__range_y_max"])}

                            <ButtonGroup aria-label="independent-axis-log" id="options-axis-log" className="w-100 mb-1">
                                {this.toggleSelect("Log x", "log_x", [null, true])}
                                {this.toggleSelect("Log y", "log_y", [null, true])}
                            </ButtonGroup>

                            <ButtonGroup aria-label="independent-axis-cat" id="options-axis-cat" className="w-100 mb-1">
                                {this.toggleSelect("Categorical x", "cat_x", [null, true])}
                                {this.toggleSelect("Categorical y", "cat_y", [null, true])}
                            </ButtonGroup>

                        </div>
                    }

                    if (el.id === "axisNoCat") {
                        return <div>
                            <h5>{el.label}</h5>

                            {this.range_ManualInputArray("Range x", "range_x", ["__range_x_min", "__range_x_max"])}
                            {this.range_ManualInputArray("Range y", "range_y", ["__range_y_min", "__range_y_max"])}

                            <ButtonGroup aria-label="independent-axis-log" id="options-axis-log" className="w-100 mb-1">
                                {this.toggleSelect("Log x", "log_x", [null, true])}
                                {this.toggleSelect("Log y", "log_y", [null, true])}
                            </ButtonGroup>


                        </div>
                    }

                    if (el.id === "labels") {
                        return <div>
                            <h5>{el.label}</h5>
                            {this.range_ManualString("Title", "title")}
                            {this.singleSelect("Name", "hover_name", allColOptions)}
                            {this.multiSelect("Data", "hover_data", allColOptions)}
                        </div>
                    }

                })
            }
        </div>

    }

}



PlotterBase.defaultProps = {};

PlotterBase.propTypes = {

    /**
    * The config the user sets in this component.
    */
    config: PropTypes.any,

    /**
     * All currently available column options
     */
    allColOptions: PropTypes.any.isRequired,

    /**
     * Currently available categorical options
     */
    catColOptions: PropTypes.any.isRequired,

    /**
    * Currently available numerical options
    */
    numColOptions: PropTypes.any.isRequired,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};

