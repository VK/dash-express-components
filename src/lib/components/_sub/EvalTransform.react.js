import SubComponentBase from "./SubComponentBase";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import { compileCode } from '@nx-js/compiler-util';

export default class EvalTransform extends SubComponentBase {
    constructor(props) {
        super(props);

        this.state =
        {
            ...this.state,
            newColName: "",
            newColFormula: "",
            newColComputeResult: {}
        }
        if ("config" in props) {
            this.state = {
                ...this.state,
                newColName: ("col" in props.config) ? props.config.col : "",
                newColFormula: ("formula" in props.config) ? props.config.formula : ""
            };
        }
    }

    static config_to_string(el) {
        return <span><b>{el.col}</b> = {el.formula}</span>
    }

    config_from_state(input) {
        return {
            type: "eval",
            col: input.newColName,
            formula: input.newColFormula
        }
    }


    static fix_variable_name(str) {
        return str.replaceAll("»", "RightPointingDoubleAngle");
    }

    static eval(input) {
        let current_meta = input["meta"];

        let formula = input["formula"].slice();
        let col = input["col"];

        let res = undefined;
        let error = false;
        let message = null;
        let type = undefined;
        try {

            Object.keys(current_meta).forEach(c => {
                formula = formula.replaceAll(c, EvalTransform.fix_variable_name(c));
            });

            let variables = {
                "at_pi": 3.14159265359,
                "at_e": 2.71828182846,
                "at_hbar": 6.58211951e-16,
                "at_c": 2.99792458e17,
                "at_hbar_c": 197.326979,
                sin: Math.sin,
                cos: Math.cos,
                tan: Math.tan,
                arcsin: Math.asin,
                arccos: Math.acos,
                arctan: Math.atan,
                arctan2: Math.atan2,

                sinh: Math.sinh,
                cosh: Math.cosh,
                tanh: Math.tanh,

                arcsinh: Math.asinh,
                arccosh: Math.acosh,
                arctanh: Math.atanh,



                exp: Math.exp,
                log: Math.log,
                log10: Math.log10,
                log1p: Math.log1p,
                expm1: Math.expm1,

                sqrt: Math.sqrt,

                ...Object.keys(current_meta).reduce(function (result, key) {
                    if (current_meta[key]["type"] === "numerical") {
                        result[EvalTransform.fix_variable_name(key)] = current_meta[key].median;
                    }
                    if (current_meta[key]["type"] === "bool") {
                        result[EvalTransform.fix_variable_name(key)] = true;
                    }
                    if (current_meta[key]["type"] === "categorical") {
                        result[EvalTransform.fix_variable_name(key)] = current_meta[key].cat[0];
                    }
                    if (current_meta[key]["type"] === "temporal") {
                        result[EvalTransform.fix_variable_name(key)] = new Date(current_meta[key].median);
                    }
                    return result
                }, {})
            };


            const code = compileCode('return ' + formula.replaceAll("\@", "at_").replaceAll("&", "&&"));
            res = code(variables);

        }
        catch (e) {
            error = true;
            message = e.message;
        }

        if (!error) {


            if (String(res).indexOf(":") >= 0) {
                try {
                    let test_time = new Date(res);
                    if (test_time.getTime() === test_time.getTime()) { type = "temporal"; }
                } catch (e) {
                }
            }

            if (type !== "temporal") {
                type = {
                    number: "numerical",
                    boolean: "bool",
                    string: "categorical",
                    undefined: "?"
                }[String(typeof res)];
            }
        }

        if (type === "?") {
            error = true;
            message = "Evaluation error!";
        }

        if (type === "numerical" && isNaN(res)) {
            error = true;
            message = "Evaluation error!";
        }

        let output = {
            value: res, error: error, message: message, type: type
        };


        let new_meta = { ...current_meta };
        new_meta[col] = SubComponentBase.get_dummy_meta_entry(type, res);
        output["new_meta"] = new_meta;


        return output;
    }


    render() {

        const {
            newColName,
            newColFormula,
            newColComputeResult,
            meta
        } = this.state;

        return <div>

            <div className="color-helper-blue">Create a new column computed by row data.</div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">New column</InputGroup.Text>
                <FormControl value={newColName} onChange={e => {
                    this.setStateConfig(
                        {
                            newColName: e.target.value,
                            newColFormula: newColFormula
                        }
                    );
                }} />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Formula</InputGroup.Text>
                <FormControl as="textarea" rows={3} value={newColFormula} onChange={e => {

                    let dummy = {
                        "type": "eval",
                        "col": newColName,
                        "formula": e.target.value,
                    }

                    this.setStateConfig({
                        newColName: newColName,
                        newColFormula: e.target.value,
                        new_transform: dummy,
                        newColComputeResult: EvalTransform.eval(
                            {
                                ...dummy,
                                meta: meta
                            }
                        )
                    })
                }}
                />
            </InputGroup>

            {newColComputeResult && "error" in newColComputeResult && newColComputeResult.error && <Alert>{newColComputeResult.message}</Alert>}
            {newColComputeResult && "error" in newColComputeResult && !newColComputeResult.error &&
                <Alert variant="success">New col: {newColName} ({newColComputeResult.type}) e.q. {newColComputeResult.value}</Alert>}

        </div>

    }
}



EvalTransform.defaultProps = {};

EvalTransform.propTypes = {

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