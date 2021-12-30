import { ifElse, none } from 'ramda';
import { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from 'react-select';
import { singleColorStyle, multiColorStyle } from '../sub/Base.react';

export default class PlotterBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            allColOptions: props.allColOptions,
            numColOptions: props.numColOptions,
            catColOptions: props.catColOptions
        };

    }


    static icon = (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" viewBox="0 0 46 46"><path fill="none" d="M0 0h46v46H0z"></path></svg>)
    static label = "Empty plot";
    static type = "base";


    preferSimple(o) {
        let no = { ...o };


        Object.keys(o).forEach(k => {
            if (Array.isArray(o[k])) {
                if (o[k].length === 0) {
                    delete no[k];
                } else if (o[k].length === 1) {
                    no[k] = no[k][0];
                }
            }
        })

        return no;
    }

    setStateConfig(input) {

        let cfg = this.config_from_state(input);
        this.setState({
            ...input,
            config: cfg
        });
        this.props.setProps(
            { config: cfg }
        );

    }

    config_from_state(input) {
        return {
            type: "scatter",
        }
    }


    /**
     * external parameters change
     */
    UNSAFE_componentWillReceiveProps(newProps) {


        this.setState(
            { config: newProps.config }
        )
        if ("params" in newProps.config) {
            this.setState({
                ...newProps.config.params
            })
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


    multiSelect(varname, options) {

        const v = this.state[varname];

        return (<InputGroup className="mb-1 w-100">
            <InputGroup.Text className="d-flex flex-grow-1" style={{ "minWidth": 75 }}>{varname}</InputGroup.Text>
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

    singleSelect(varname, options) {

        const v = this.state[varname];

        return (<InputGroup className="mb-1 w-100">
            <InputGroup.Text className="d-flex flex-grow-1" style={{ "minWidth": 75 }}>{varname}</InputGroup.Text>
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
