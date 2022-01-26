export default () => Promise.resolve(

    window.Plotly ||
    import(/* webpackChunkName: "plotlyjs" */ 'plotly.js-dist').then(({ default: Plotly }) => {
        window.Plotly = Plotly;
        return Plotly;
    })

);

