
def compute(cfg, inputDataFrame):

    # cfg = {
    #     "groupby": ["type"],
    #     "col": "nb",
    #     "upper": 0,
    #     #"lower": 1.5
    # }

    def iqr_filter(data):
        Q1 = data[cfg["col"]].quantile(0.25)
        Q3 = data[cfg["col"]].quantile(0.75)
        IQR = Q3 - Q1
        
        if "upper" in cfg and "lower" in cfg:
            return data.query(f'(@Q1 - {cfg["lower"]} * @IQR) <= {cfg["col"]} <= (@Q3 + {cfg["upper"]} * @IQR)')
        if "upper" in cfg:
            return data.query(f'{cfg["col"]} <= (@Q3 + {cfg["upper"]} * @IQR)')
        if "lower" in cfg:
            return data.query(f'(@Q1 - {cfg["lower"]} * @IQR) <= {cfg["col"]}')
        return data

    return inputDataFrame.groupby(cfg["groupby"]).apply(iqr_filter).reset_index(drop=True)


def dimensions(cfg, inputDataFrame):
    return [
        *cfg["groupby"],
        cfg["col"]
    ]
