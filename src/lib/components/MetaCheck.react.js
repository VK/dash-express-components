import React from 'react';
import Base from './sub/Base.react';
import Accordion from 'react-bootstrap/Accordion';



export default class MetaCheck extends Base {
    constructor(props) {
        super(props);
    }



    render() {

        let { meta } = this.state;


        return (
            <Accordion.Item eventKey="metacheck">
                <Accordion.Header>Table Structure</Accordion.Header>
                <Accordion.Body className="p-1" style={{
                    maxHeight: "200px",
                    overflowY: "auto"
                }}>

                    <table className="table">

                        <thead>
                            <tr>
                                <th scope="col">Column</th>
                                <th scope="col">Type</th>
                                <th scope="col">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(meta).map(col => {

                                    let type = meta[col].type;


                                    let className = {
                                        categorical: "table-info",
                                        bool: "table-success",
                                        temporal: "table-danger",
                                        numerical: "table-warning",
                                    }[type];

                                    let t = {
                                        categorical: "C",
                                        bool: "B",
                                        temporal: "T",
                                        numerical: "N",
                                    }[type];

                                    let e = {
                                        categorical: (("cat" in meta[col]) ? meta[col].cat[0] : ''),
                                        bool: "true",
                                        temporal: meta[col].median,
                                        numerical: meta[col].median,
                                    }[type];


                                    return <tr className={className} key={"tab-" + col}><th>{col}</th><td>{t}</td><td>{e}</td></tr>
                                })
                            }
                        </tbody>
                    </table>

                </Accordion.Body>

            </Accordion.Item>
        )

    }
}



MetaCheck.defaultProps = {};


MetaCheck.propTypes = {

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
