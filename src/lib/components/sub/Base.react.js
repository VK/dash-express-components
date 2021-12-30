import { Component } from 'react';
import chroma from 'chroma-js';


const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

export const singleColorStyle = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? data.color
                    : isFocused
                        ? color.alpha(0.1).css()
                        : color.alpha(0.025).css(),
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : color.darken(2).css(),
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.color
                        : color.alpha(0.3).css()
                    : undefined,
            },
        };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};


export const multiColorStyle = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? data.color
                    : isFocused
                        ? color.alpha(0.1).css()
                        : color.alpha(0.025).css(),
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : color.darken(2).css(),
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.color
                        : color.alpha(0.3).css()
                    : undefined,
            },
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: chroma(data.color).darken(2).desaturate(1).css(),
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'white',
        },
    }),
};

export const type_colors = {
    numerical: "#ffbf00",
    temporal: "#ff0019",
    categorical: "#00ddff",
    bool: "#00ff3c",
    undefined: "#555555"
};

export default class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            meta: props.meta,
            meta_out: props.meta,
            ...this.get_columns(props.meta)
        };
    }




    update_meta_out(new_meta_out) {
        this.setState({
            meta_out: new_meta_out
        });
        this.props.setProps({
            meta_out: new_meta_out
        });
    }

    update_config(new_config) {
        this.setState({
            config: new_config
        });
        this.props.setProps({
            config: new_config
        });
    }

    /**
     * A helper to compute the column dropdown options based on the column metadata
     * We also filter continous and categorical variables, since some options only
     * work with one of them.
     * @param meta 
     * @returns 
     */
    get_columns(meta) {


        console.log(meta);

        const numCols = Object.keys(meta)
            .filter((key) => {
                return meta[key].type === "numerical" || meta[key].type === "temporal"| meta[key].type === "undefined";
            })
            .reduce((obj, key) => {
                obj[key] = meta[key];
                return obj;
            }, {});

        const catCols = Object.keys(meta)
            .filter((key) => {
                return meta[key].type === "categorical" | meta[key].type === "bool" | meta[key].type === "undefined";
            })
            .reduce((obj, key) => {
                obj[key] = meta[key];
                return obj;
            }, {});

        return {
            numCols: numCols,
            catCols: catCols,

            allColOptions: Object.keys(meta).map(option => ({
                label: String(option),
                value: option,
                color: type_colors[meta[option].type]
            })),
            numColOptions: Object.keys(numCols).map(option => ({
                label: String(option),
                value: option,
                color: type_colors[meta[option].type]
            })),
            catColOptions: Object.keys(catCols).map(option => ({
                label: String(option),
                value: option,
                color: type_colors[meta[option].type]
            })),


        }
    }

    /**
     * external parameters like the dataframe metadata might change.
     * Then we have to update the content
     */
    UNSAFE_componentWillReceiveProps(newProps) {

        if (newProps.config !== this.props.config) {
            this.setState(
                { config: newProps.config }
            )
        }

        if (newProps.meta !== this.props.meta) {
            this.setState(
                { meta: newProps.meta }
            )
            this.setState(
                this.get_columns(newProps.meta)
            )
        }

        if (newProps.meta_out !== this.props.meta_out) {
            this.setState(
                { meta_out: newProps.meta_out }
            )
        }

    }

    render() {
        return false;
    }
}


Base.defaultProps = {};

Base.propTypes = {

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
