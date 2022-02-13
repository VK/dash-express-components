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

        let new_meta = {};
        input.i.forEach(el => new_meta[el] = input.meta[el]);

        let types = [];
        input.stubnames.forEach(el => {
            let group = Object.keys(input.meta).filter(s => s.includes(input.sep) && WideToLong.sep_split(s, input.sep) == el);
            new_meta[el] = input.meta[group[0]];
            let new_types = group.map(s => s.split(input.sep).slice(-1)[0]);
            types = [...types, ...new_types];
        });

        types = [...new Set(types)];

        new_meta[input.j] = {
            cat: types,
            type: "categorical"
        };

        input.meta = new_meta;

        return {
            value: 0, error: false, message: "", type: "categorical", new_meta: new_meta
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
                            value: WideToLong.sep_split(e.value, sep),
                            label: WideToLong.sep_split(e.label, sep),
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

            Set the name of the column, the separator and the suffix type.
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Type</InputGroup.Text>
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


            Select the columns that should be grouped into new variabels.

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


            Select the columns that you want to keep. Note! You must keep all columns to define an index.
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