// export default () => Promise.resolve(window.dash_table)

// export default () => new Promise(
//     function (resolve, reject) {

//         window.setTimeout(
//             function () {

//                 console.log("HELLO");
//                 console.log(window.dash_table.DataTable);
//                 resolve(window.dash_table.DataTable);
//             }, 100);
//     });


// import { lazy } from 'react';

export const tableLoader = () => {
    let resolve;
    const isReady = new Promise(r => {
        resolve = r;
    });

    const state = {
        isReady,
        get: Promise.resolve(promise()).then(res => {
            setTimeout(async () => {
                await resolve(true);
                state.isReady = true;
            }, 0);

            console.log("HELLO");
            console.log(window.dash_table.DataTable);
            return window.data_table.DataTable;
        })

    };

    Object.defineProperty(DataTable, '_dashprivate_isLazyComponentReady', {
        get: () => state.isReady
    });

    return state.get;
};

// export const inheritAsyncDecorator = (target, source) => {
//     Object.defineProperty(target, '_dashprivate_isLazyComponentReady', {
//         get: () => isReady(source)
//     });
// }

// export const isReady = target => target &&
//     target._dashprivate_isLazyComponentReady;