import React from 'react';
import Base from './_sub/Base.react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Accordion from 'react-bootstrap/Accordion';

import AggrTransform from './_sub/AggrTransform.react';
import EvalTransform from './_sub/EvalTransform.react';
import MeltTransform from './_sub/MeltTransform.react';
import CombinecatTransform from './_sub/CombinecatTransform.react';
import CategoryLookup from './_sub/CategoryLookup.react';
import DropnaTransform from './_sub/DropnaTransform.react';
import WideToLong from './_sub/WideToLong.react';
import ZerosToNanTransform from './_sub/ZerosToNanTransform.react';
import RenameTransform from './_sub/RenameTransform.react';
import StrSplitTransform from './_sub/StrSplitTransform.react';


import AggrSvg from 'react-svg-loader!./_svg/aggr.svg';
import EvalSvg from 'react-svg-loader!./_svg/eval.svg';
import MeltSvg from 'react-svg-loader!./_svg/melt.svg';
import CombinecatSvg from 'react-svg-loader!./_svg/combinecat.svg';
import CatlookupSvg from 'react-svg-loader!./_svg/catlookup.svg';
import DropnaSvg from 'react-svg-loader!./_svg/dropna.svg';
import WideToLongSvg from 'react-svg-loader!./_svg/wide_to_long.svg';
import ZerostoNanSvg from 'react-svg-loader!./_svg/zerostonan.svg';
import RenameSvg from 'react-svg-loader!./_svg/rename.svg';
import StrSplitSvg from 'react-svg-loader!./_svg/str.split.svg';


/**
 * <div style="width:450px; margin-left: 20px; float: right;  margin-top: -150px;">
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/transform.png"/>
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/transform-modal.png"/>
 * <img src="https://raw.githubusercontent.com/VK/dash-express-components/main/.media/transform-types.png"/>
 * </div>
 * 
 * The `Transform` component helps to create user defined data transformations.
 * Currently basic transformations are available, like:
 * 
 * <ul style="margin-left: 20px;">
 *    <li><b>eval</b></li>
 *    <li><b>groupby([...]).aggr([...])</b></li>
 *    <li><b>melt</b></li>
 *    <li><b>wide_to_long</b></li>
 *    <li><b>replace</b></li>
 *    <li><b>rename</b></li>
 * </ul>
 * @hideconstructor
 * 
 * @example
 * import dash_express_components as dxc
 * import plotly.express as px
 * 
 * meta = dxc.get_meta(px.data.gapminder())
 * 
 * dxc.Transform(
 *    id="transform",
 *    meta=meta
 * )
 * @public
 */
class Transform extends Base {

    static trafo_groups = [
        { label: "New columns", value: "col" },
        { label: "Reshape data", value: "reshape" },
        { label: "Missing data", value: "missing" },
        { label: "Metadata", value: "meta" },
    ]

    static known_trafos = [
        {
            group: "col", type: "eval", class: EvalTransform,
            "label": "Compute new column", svg: <EvalSvg />
        },
        {
            group: "col", type: "strsplit", class: StrSplitTransform,
            "label": "Compute a string split", svg: <StrSplitSvg />
        },
        {
            group: "reshape", type: "aggr", class: AggrTransform,
            "label": "Aggregate grouped dataset", svg: <AggrSvg />
        },
        {
            group: "col", type: "combinecat", class: CombinecatTransform,
            "label": "Combine multiple columns to new category", svg: <CombinecatSvg />
        },
        {
            group: "reshape", type: "melt", class: MeltTransform,
            "label": "Rearrange multiple colums to one", svg: <MeltSvg />
        },
        {
            group: "reshape", type: "wide_to_long", class: WideToLong,
            "label": "Rearrange columns based on naming", svg: <WideToLongSvg />
        },
        {
            group: "col", type: "catlookup", class: CategoryLookup,
            "label": "Apply a lookup on a categorical column", svg: <CatlookupSvg />
        },
        {
            group: "missing", type: "dropna", class: DropnaTransform,
            "label": "Remove rows with nan values", svg: <DropnaSvg />
        },
        {
            group: "missing", type: "zerostonan", class: ZerosToNanTransform,
            "label": "Replace zero values with nan values", svg: <ZerostoNanSvg />
        },
        {
            group: "meta", type: "rename", class: RenameTransform,
            "label": "Rename multiple columns", svg: <RenameSvg />
        }
    ]


    constructor(props) {
        super([], props);



        this.state =
        {
            ...this.state,

            /* state of the modal to add new filters */
            showAddModal: false,
            showChooseModal: false,

            transformIndex: undefined,

            transformType: "",
            sub_config: {}
        };

        this.update_config(this.state.config, true);
    }

    handleClose() {
        this.setState({ showAddModal: false });
    }
    handleShow() {
        this.setState({ showAddModal: true });
    }

    handleChooseClose() {
        this.setState({ showChooseModal: false });
    }
    handleChooseShow() {
        this.setState({ showChooseModal: true });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const update_config_needed = (newProps.config !== this.props.config);

        super.UNSAFE_componentWillReceiveProps(newProps);

        if (update_config_needed && "config" in newProps) {
            this.update_config(newProps.config);
        }

    }


    update_config(new_config, constructor = false) {
        super.update_config(new_config, constructor);

        //let new_meta = JSON.parse(JSON.stringify(this.state.meta))
        let new_meta = { ...this.state.meta };
        let meta_stages = [];
        let stage_results = [];
        meta_stages.push(new_meta);

        if (new_config)
            new_config.forEach(el => {

                let transform_class = Transform.known_trafos.filter(t => t["type"] === el["type"])[0]["class"];
                let res = transform_class.eval(
                    {
                        ...el,
                        meta: new_meta
                    }
                );
                if (res["new_meta"] != undefined) {
                    new_meta = res["new_meta"];
                    meta_stages.push(new_meta);
                } else {
                    meta_stages.push({});
                }
                stage_results.push(res);


            });

        super.update_meta_out(new_meta, constructor);


        if (constructor) {
            this.state = {
                ...this.state,
                meta_stages: meta_stages,
                stage_results: stage_results,
                ...this.get_columns(new_meta)
            }
        } else {
            this.setState({
                meta_stages: meta_stages,
                stage_results: stage_results,
                ...this.get_columns(new_meta)
            });
        }
    }

    get_transform_blocks() {
        const { config, stage_results } = this.state;

        if (config) {
            return <div>
                {
                    config.map((el, id) => {

                        let transform_class = Transform.known_trafos.filter(t => t["type"] === el["type"])[0]["class"];

                        let config_string = transform_class.config_to_string(el);
                        let variant = (stage_results[id].error) ? 'secondary' : 'primary';
                        let error_string = (stage_results[id].error) ? (<span className="text-danger"><br /><b>Error: </b>{stage_results[id].message}</span>) : '';

                        return (<Alert dismissible variant={variant} key={id} onClose={() => {

                            let new_config = config.filter((e, idx) => idx !== id);
                            this.update_config(new_config)

                        }}>

                            {config_string}
                            {error_string}

                            <button className='btn-close btn-edit'

                                onClick={() => {

                                    let update_state = {
                                        transformIndex: id,
                                        transformType: el.type,
                                        sub_config: el
                                    };

                                    this.setState(update_state, () => {
                                        this.handleShow();
                                    })

                                }}
                            ></button>

                        </Alert>)
                    }
                    )
                }

            </div>
        }
    }







    get_modal_blocks() {

        const {
            allColOptions,
            catColOptions,
            numColOptions,
            allOptions,
            meta_out,


            showAddModal,
            transformType,

            sub_config,
            config,

            transformIndex,
            meta_stages
        } = this.state;

        const {
            id
        } = this.props;

        const stt = Transform.known_trafos.filter((el) => el.type === transformType);
        const tt = (stt.length === 1) ? stt[0] : undefined;


        return (<Modal
            centered
            backdrop="static"
            animation={false}
            show={showAddModal}
            onHide={() => this.handleClose()
            }
        >
            <Modal.Header closeButton>
                <Modal.Title>{(stt.length === 1) ? tt.label : "Add transform"}</Modal.Title>
            </Modal.Header>
            <Modal.Body><div style={{ minHeight: "15em" }} className="mb-3">


                <Button
                    key={id + "change-transform-button"}
                    variant="outline-secondary"
                    className="d-flex align-items-center w-100 mb-2"
                    onClick={() => this.handleChooseShow()}
                    style={{ "height": "110px" }}
                >

                    {(tt && "svg" in tt) && <div className="w-100">{tt.svg}</div>}
                    {!(tt && "svg" in tt) && <div className="w-100 h3">Choose a transformation type</div>}

                </Button>



                {
                    Transform.known_trafos.map(trafo_el => {

                        let input_meta = (transformIndex === undefined) ? meta_out : meta_stages[transformIndex];
                        let stage_options = this.get_columns(input_meta);

                        return (
                            transformType === trafo_el["type"] &&
                            <trafo_el.class
                                key={"config" + trafo_el["type"]}
                                config={sub_config}
                                meta={input_meta}
                                allColOptions={stage_options.allColOptions}
                                catColOptions={stage_options.catColOptions}
                                numColOptions={stage_options.numColOptions}
                                allOptions={stage_options.allOptions}
                                setProps={e => { if ("config" in e) { this.setState({ sub_config: e.config }) } }}
                            />
                        )
                    })
                }


            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleClose()}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {

                    if ("type" in sub_config) {


                        if (transformIndex === undefined) {
                            //add a new transform


                            let transform_class = Transform.known_trafos.filter(el => el["type"] === sub_config["type"])[0]["class"];
                            let res = transform_class.eval(
                                {
                                    ...sub_config,
                                    meta: meta_out
                                }
                            );

                            if (!res.error || window.confirm("Do you want to add the transform, even with errors?")) {
                                let new_config = [
                                    ...config,
                                    sub_config
                                ];

                                this.update_config(new_config);
                                this.handleClose();
                            }

                        } else {
                            //update a transform

                            let transform_class = Transform.known_trafos.filter(el => el["type"] === sub_config["type"])[0]["class"];
                            let res = transform_class.eval(
                                {
                                    ...sub_config,
                                    meta: meta_stages[transformIndex]
                                }
                            );

                            if (!res.error || window.confirm("Do you want to add the transform, even with errors?")) {
                                let new_config = config;
                                new_config[transformIndex] = sub_config;

                                this.update_config(new_config);
                                this.handleClose();
                            }
                        }


                    }


                }}>
                    {(transformIndex === undefined) ? "Add" : "Update"}
                </Button>
            </Modal.Footer>
        </Modal>)

    }



    get_choose_modal() {

        const {
            showChooseModal
        } = this.state;

        const {
            id
        } = this.props;

        return (<Modal
            size="xl"
            centered
            backdrop="static"
            animation={false}
            show={showChooseModal}
            onHide={() => this.handleChooseClose()}
            key={id + "-trafo-type-modal"}
        >
            <Modal.Header closeButton>
                <Modal.Title>Transformation Types</Modal.Title>
            </Modal.Header>
            <Modal.Body><div className="mt-2 container row" style={{ paddingRight: 0 }}>

                {Transform.trafo_groups.map(gr => {

                    return <div className='p-1 col-6'><h4>{gr.label}</h4> {


                        Transform.known_trafos.filter(pt => pt.group == gr.value).map(pt => {


                            return (
                                <Button
                                    key={"set-plot-" + pt.type}
                                    variant="outline-secondary"
                                    className="d-flex align-items-center w-100 mb-2"

                                    onClick={(e) => {

                                        this.setState({
                                            transformType: pt.type
                                        });
                                        this.handleChooseClose()
                                    }}

                                >

                                    <div style={{ "transform": "scale(.6)", "transformOrigin": "0 0", width: "180px", height: "60px" }}>{(pt && "svg" in pt) ? pt.svg : ""}</div>
                                    <div className="flex-grow-1 m-1 h5">
                                        {(pt && "label" in pt) ? pt.label : ""}
                                    </div>

                                </Button>
                            );
                        })
                    } </div>


                })

                }




            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleChooseClose()}>
                    Close
                </Button>

            </Modal.Footer>
        </Modal>)
    }

    render() {

        return (
            <div>
                {this.get_transform_blocks()}

                <Button className='w-100' onClick={() => {
                    this.setState({
                        transformType: "",
                        sub_config: {},
                        transformIndex: undefined
                    }, () => {
                        this.handleShow();
                    });
                }}>
                    Add transformation
                </Button>

                {this.get_modal_blocks()}
                {this.get_choose_modal()}
            </div>
        )

    }
}



Transform.defaultProps = {};

/**
 * @typedef
 * @public
 * @enum {}
 */
Transform.propTypes = {

    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string.isRequired,

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


/**
 * @private
 */
export default Transform;
