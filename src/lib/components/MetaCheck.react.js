import React from 'react';
import Base from './_sub/Base.react';

/**
 * Bla bla
 * 
 * 
 * @hideconstructor
 * 
 * @example
 * import dash_express_components as dxc
 * import plotly.express as px
 * 
 * meta = dxc.get_meta(px.data.gapminder())
 * 
 * dxc.MetaCheck(
 * ???
 * )
 * @public
 */
class MetaCheck extends Base {
    constructor(props) {
        super([], props);
    }

    render() {

        let { meta } = this.state;

        return (

            <div className="p-3" style={{
                margin: "-1rem -1.25rem",
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
                                    undefined: "?"
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

            </div>
        )

    }
}



MetaCheck.defaultProps = {};

/**
 * @typedef
 * @public
 * @enum {}
 */
MetaCheck.propTypes = {

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
 export default MetaCheck;