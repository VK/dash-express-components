
def compute(cfg, inputDataFrame):

    # cfg = {
    #     "groupby": ["type"],
    #     "col": "nb",
    #     "upper": 0,
    #     #"lower": 1.5
    # }

    # rename all columns with »
    trafo_cols = [c for c in inputDataFrame.columns if "»" in c]
    inputDataFrame.rename(
        columns={c: c.replace("»", "RightPointingDoubleAngle")
                 for c in trafo_cols},
        inplace=True
    )

    # compute the filter formula
    formula = ""
    if "upper" in cfg and "lower" in cfg:
        formula = f'(@Q1 - {cfg["lower"]} * @IQR) <= {cfg["col"]} <= (@Q3 + {cfg["upper"]} * @IQR)'
    elif "upper" in cfg:
        formula = f'{cfg["col"]} <= (@Q3 + {cfg["upper"]} * @IQR)'
    elif "lower" in cfg:
        formula = f'(@Q1 - {cfg["lower"]} * @IQR) <= {cfg["col"]}'

    # compute the transformed formula + the transformed filter col +  groupby names
    for c in trafo_cols:
        new_c = c.replace("»", "RightPointingDoubleAngle")
        formula = formula.replace(c, new_c)
    col = cfg["col"].replace("»", "RightPointingDoubleAngle")
    groupby = [
        el.replace("»", "RightPointingDoubleAngle")
        for el in cfg["groupby"]
    ]    

    # create a internal filter formula
    def iqr_filter(data):
        Q1 = data[col].quantile(0.25)
        Q3 = data[col].quantile(0.75)
        IQR = Q3 - Q1
        return data.query(formula)

    # apply the IQR filtering
    if len(formula) > 0:
        if len(groupby) == 0:
            inputDataFrame = iqr_filter(inputDataFrame).reset_index(drop=True)
        else:
            inputDataFrame = inputDataFrame.groupby(groupby).apply(
                iqr_filter).reset_index(drop=True)

    # make the back transformation
    inputDataFrame.rename(
        columns={c.replace("»", "RightPointingDoubleAngle"): c
                 for c in trafo_cols},
        inplace=True
    )

    return inputDataFrame


def dimensions(cfg, inputDataFrame):
    return [
        *cfg["groupby"],
        cfg["col"]
    ]
