from statistics import median
import plotly.express as _px


def q01(x):
    return x.quantile(0.01)


def q05(x):
    return x.quantile(0.05)


def q25(x):
    return x.quantile(0.25)


def q75(x):
    return x.quantile(0.75)


def q95(x):
    return x.quantile(0.95)


def q99(x):
    return x.quantile(0.99)


def iqr(x):
    return x.quantile(0.75) - x.quantile(0.25)


def range(x):
    return x.max() - x.min()


aggr_func = {
    "q01": q01,
    "q05": q05,
    "q25": q25,
    "q75": q75,
    "q95": q95,
    "q99": q99,
    "iqr": iqr,
    "range": range
}


def _get_dict(x, y, text):
    return dict(showarrow=False,
                x=x,
                y=y,
                text=text,
                font_size=10,
                bgcolor="#ffffff",
                opacity=0.6
                )


def _get(inputDataFrame, plotConfigData):

    params = plotConfigData["params"]

    if "lines" in params:
        if isinstance(params["lines"], str):
            params["lines"] = [params["lines"]]

    aggr_groups = {}
    aggr_needed = []
    if "aggr" in params:
        # check if aggr is needed
        aggr = params["aggr"]
        if isinstance(aggr, str):
            aggr = [aggr]
        del params["aggr"]

        for el in aggr:
            if el in ["mean", "median", "count", "range", "iqr"]:
                aggr_needed.append("median")
                aggr_needed.append(el)
                if "median" not in aggr_groups:
                    aggr_groups["median"] = {}
                if el == "count":
                    aggr_groups["median"][el] = {
                        "func": lambda k, v: f"<b>#</b> {int(v)}"
                    }
                else:
                    aggr_groups["median"][el] = {
                        "func": lambda k, v: f"<b>{k}</b><br>{v:.3E}"
                    }

            else:
                aggr_needed.append(el)
                aggr_groups[el] = {}
                aggr_groups[el][el] = {
                    "func": lambda k, v: f"<b>{k}</b><br>{v:.3E}"
                }
        aggr_needed = list(set(aggr_needed))
        aggr_needed = [aggr_func[t]
                       if t in aggr_func else t for t in aggr_needed]

    fig = _px.box(inputDataFrame, **
                  {p: v for p, v in params.items() if p != "lines"})

    if "x" in params and "y" in params and not "facet_col" in params and not "facet_row" in params:
        for idx, val in inputDataFrame.groupby(params["x"])[params["y"]].aggregate(aggr_needed).iterrows():

            for gr_name, gr in aggr_groups.items():

                add_str_array = [
                    v["func"](k, val[k])
                    for k, v in gr.items()
                ]
                fig.layout.annotations = [
                    *fig.layout.annotations,
                    _get_dict(
                        idx, val[gr_name], "<br>".join(add_str_array))
                ]

    if not "x" in params and "y" in params and not "facet_col" in params and not "facet_row" in params:
        val = inputDataFrame[params["y"]].aggregate(aggr_needed)
        for gr_name, gr in aggr_groups.items():

            add_str_array = [
                v["func"](k, val[k])
                for k, v in gr.items()
            ]
            fig.layout.annotations = [
                *fig.layout.annotations,
                _get_dict(
                    0, val[gr_name], "<br>".join(add_str_array))
            ]

    if "x" in params and not "y" in params and not "facet_col" in params and not "facet_row" in params:
        val = inputDataFrame[params["x"]].aggregate(aggr_needed)
        for gr_name, gr in aggr_groups.items():
            add_str_array = [
                v["func"](k, val[k])
                for k, v in gr.items()
            ]
            fig.layout.annotations = [
                *fig.layout.annotations,
                _get_dict(
                    val[gr_name], 0, "<br>".join(add_str_array))
            ]

    if "lines" in params and "x" in params and "y" in params and not "facet_col" in params and not "facet_row" in params:

        for l in params["lines"]:
            line_df = inputDataFrame.groupby(params["x"])[params["lines"]].aggregate(
                "median").reset_index(drop=False)

            x_vals = [ d["x"][0] for d in fig.data]
            def sorter(column):
                """Sort function"""
                sort_dict = {x: idx for idx, x in enumerate(x_vals)}
                return column.map(sort_dict)

            line_df = line_df.sort_values(by=params["x"], key=sorter)

            fig.add_scatter(
                x=line_df[params["x"]],
                y=line_df[l],
                mode='lines',
                showlegend=False, line=dict(dash='dash', color="firebrick", width=2),
                name=l
            )

    return fig
