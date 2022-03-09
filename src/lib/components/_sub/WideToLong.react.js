import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Select from 'react-select';
import { multiColorStyle, hideGroupComponents, multiCallbacks } from "./Base.react";

import Form from 'react-bootstrap/Form';


export default class WideToLong extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            groupby: [],
            stubnames: [],
            type: "Type",
            sep: "_",
            suffix: "string",
        }


        if ("config" in props) {
            this.state = {
                ...this.state,
                groupby: ("i" in props.config) ? props.config.i : [],
                stubnames: ("stubnames" in props.config) ? props.config.stubnames : [],

                type: ("j" in props.config) ? props.config.j : "Type",
                sep: ("sep" in props.config) ? props.config.sep : "_",
                suffix: ("suffix" in props.config) ? props.config.suffix : "string"
            };
        }

    }

    static config_to_string(el) {
        return <span>Combine <b>[{el.stubnames.join(", ")}]</b> with {el.j} and [{el.i.join(", ")}]</span>
    }

    config_from_state(input) {
        return {
            type: "wide_to_long",
            stubnames: input.stubnames,
            i: input.groupby,
            j: input.type,
            sep: input.sep,
            suffix: input.suffix
        }
    }


    static sep_split(str, sep) {
        let arr = str.split(sep);
        arr.splice(-1);
        return arr.join(sep);
    }


    static eval(input) {
        //stubnames
        //i
        //j
        //sep
        //suffix


        let current_meta = input["meta"];
        let error = false;
        let message = "";

        input.i.forEach(c => {
            if (!(c in current_meta)) {
                error = true;
                message = "Missing column " + c + "\n";
            }
        });

        if (error) {
            return { error: error, message: message };
        }


        let new_meta = {};
        input.i.forEach(el => new_meta[el] = input.meta[el]);

        let types = [];
        input.stubnames.forEach(el => {
            let group = Object.keys(input.meta).filter(s => s.includes(input.sep) && WideToLong.sep_split(s, input.sep) == el);

            if (group.length > 0) {
                new_meta[el] = input.meta[group[0]];
                let new_types = group.map(s => s.split(input.sep).slice(-1)[0]);
                types = [...types, ...new_types];
            } else {
                error = true;
                message = "Missing column start " + el + "\n";
            }
        });

        types = [...new Set(types)];

        new_meta[input.j] = {
            cat: types,
            type: "categorical"
        };

        input.meta = new_meta;

        return {
            value: 0, error: error, message: message, type: "categorical", new_meta: new_meta
        };
    }


    update_state(update_cfg) {
        let new_cfg = {
            groupby: this.state.groupby,
            stubnames: this.state.stubnames,
            type: this.state.type,
            sep: this.state.sep,
            suffix: this.state.suffix,
        }
        new_cfg = { ...new_cfg, ...update_cfg };

        this.setStateConfig(new_cfg);
    }



    render() {

        const {
            allColOptions,
            allOptions,

            groupby,
            stubnames,
            type,
            sep,
            suffix

        } = this.state;

        let sepColOptions = allColOptions.filter((o) => "options" in o || ("value" in o && o.value.includes(sep)))
            .map(
                (o) => {
                    if ("options" in o) {
                        let new_options = o.options
                            .filter(e => e.value.includes(sep))
                            .map((e) => {
                                return {
                                    ...e,
                                    value: WideToLong.sep_split(e.value, sep),
                                    label: WideToLong.sep_split(e.label, sep),
                                }
                            });
                        new_options = new_options.filter((value, index, self) =>
                            index === self.findIndex((t) => (
                                t.place === value.place && t.label === value.label
                            ))
                        )
                        return { ...o, options: new_options };
                    } else {
                        return {
                            ...o,
                            value: WideToLong.sep_split(o.value, sep),
                            label: WideToLong.sep_split(o.label, sep),
                        }
                    }
                }
            ).filter((value, index, self) => ("options" in value) ||
                index === self.findIndex((t) => (
                    t.place === value.place && t.label === value.label
                ))
            )

        let allsepColOptions = sepColOptions.filter(o => "value" in o);
        sepColOptions.forEach((el) => {
            if ("options" in el) {
                allsepColOptions = [...allsepColOptions, ...el.options]
            }
        })


        return <div>

            <div className="color-helper-blue">Extract a variable type from the input colum names:</div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1" >Type</InputGroup.Text>
                <FormControl value={type} onChange={e => {
                    this.update_state({ type: e.target.value });
                }} />


                <InputGroup.Text id="basic-addon2">sep</InputGroup.Text>
                <FormControl value={sep} onChange={e => {
                    this.update_state({ sep: e.target.value });
                }} />

                <InputGroup.Text id="basic-addon2">Suffix</InputGroup.Text>
                <Form.Select
                    value={suffix}
                    onChange={e => {
                        this.update_state({
                            suffix: e.target.value,
                        });
                    }}
                >
                    <option value="number">Number</option>
                    <option value="string">String</option>
                </Form.Select>
            </InputGroup>


            <div className="color-helper-green">Select the columns that should be grouped into new variabels.</div>

            <Select
                className="mb-3"
                key="selectCols"
                options={sepColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}
                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "stubnames",
                    allsepColOptions
                )}
            />


            <div className="color-helper-red">Select the columns that should be kept.<br /><b>Note!</b> You must keep all columns that define the index.</div>
            <Select
                className="mb-3"
                options={allColOptions}
                styles={multiColorStyle}
                components={hideGroupComponents}

                {...multiCallbacks(
                    this,
                    (s) => this.update_state(s),
                    "groupby",
                    allOptions
                )}
            />


        </div>

    }
}



WideToLong.defaultProps = {};

WideToLong.propTypes = {

    /**
    * The config the user sets in this component.
    */
    config: PropTypes.any,

    /**
     * The metadata this section is based on.
     */
    meta: PropTypes.any.isRequired,

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