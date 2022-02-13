import plotly.graph_objects as _go
import numpy as _np
import pandas as _pd
import plotly.express as _px


def _get(inputDataFrame, plotConfigData):
    fig = _go.Figure()
    if "x" in plotConfigData["params"]:
        # extrat params
        x = plotConfigData["params"]["x"]
        nbins = plotConfigData["params"]["nbins"]
        cumulative = True if "cumulative" in plotConfigData[
            "params"] and plotConfigData["params"]["cumulative"] else False
        histnorm = "count"
        normalize = False
        if "histnorm" in plotConfigData["params"]:
            if "density" in plotConfigData["params"]["histnorm"]:
                histnorm = "density"
                normalize = True
            if "percent" in plotConfigData["params"]["histnorm"]:
                histnorm = "percent"
                normalize = True

        groupParams = []
        # add color and facet entries to possible data groupings
        if "color" in plotConfigData["params"]:
            groupParams.append(
                plotConfigData["params"]["color"])
        if "facet_row" in plotConfigData["params"]:
            groupParams.append(
                plotConfigData["params"]["facet_row"])
        if "facet_col" in plotConfigData["params"]:
            groupParams.append(
                plotConfigData["params"]["facet_col"])
        groupParams = list(set(filter(None, groupParams)))


        plotData = _pd.DataFrame()
        if (len(groupParams) > 0):
            for group, allValues in inputDataFrame.groupby(groupParams):
                
                if not isinstance(group, list):
                    group = [group]

                # extract the sampels to compute the histogram
                histSamples = _np.array(
                    allValues[x].dropna().astype("float"))

                # compute the grid
                histX = _np.linspace(
                    _np.min(histSamples), _np.max(histSamples), nbins)
                gridNorm = histX[1]-histX[0]
                computeGrid = _np.linspace(
                    histX[0]-0.5*gridNorm, histX[-1]+0.5*gridNorm, nbins+1)

                # bin the data
                histY, _ = _np.histogram(
                    histSamples, bins=computeGrid, density=normalize)
                if cumulative:
                    histY = _np.cumsum(histY)
                if normalize:
                    histY = histY*gridNorm
                if histnorm == "percent":
                    histY *= 100.0

                colName = (
                    'cumulative ' if cumulative else '') + histnorm
                extra = _pd.DataFrame(
                    _np.transpose([histX, histY]))
                extra.columns = [x, colName]
                for gr_idx, gr_name in enumerate(groupParams):
                      extra[gr_name] = group[gr_idx]

                plotData = plotData.append(extra)

        else:
            # extract the sampels to compute the histogram
            histSamples = _np.array(inputDataFrame[x])

            # compute an grid
            histX = _np.linspace(
                _np.min(histSamples), _np.max(histSamples), nbins)
            gridNorm = histX[1]-histX[0]
            computeGrid = _np.linspace(
                histX[0]-0.5*gridNorm, histX[-1]+0.5*gridNorm, nbins+1)

            # bin the data
            histY, _ = _np.histogram(
                histSamples, bins=computeGrid, density=normalize)
            if cumulative:
                histY = _np.cumsum(histY)
            if normalize:
                histY = histY*gridNorm
            if histnorm == "percent":
                histY *= 100.0

            plotData = _pd.DataFrame(
                _np.transpose([histX, histY]))
            colName = (
                'cumulative ' if cumulative else '') + histnorm
            plotData.columns = [x, colName]

        params = {p: plotConfigData["params"][p] for p in plotConfigData["params"] if p not in [
            "nbins", "cumulative", "histnorm", "barmode"]}
        params["y"] = colName


        fig = _px.line(plotData, **params)

    return fig