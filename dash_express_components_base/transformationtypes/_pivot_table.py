


def compute(cfg, inputDataFrame):
    """
    Creates a pivot table from the input DataFrame and renames the MultiIndex columns.

    Parameters:
    - cfg: dict containing configuration for the pivot table
        - values: str or list of str, the column(s) to aggregate
        - index: str or list of str, the column(s) to group by
        - columns: str or list of str, the column(s) to pivot
        - aggfunc: callable, string, or list of callables, aggregation function(s) (default: [])
    - inputDataFrame: pd.DataFrame, input data

    Returns:
    - outputDataFrame: pd.DataFrame, the pivot table with flattened columns
    """
    import pandas as pd

    values = cfg["values"]
    index = cfg["index"]
    columns = cfg["columns"]
    aggfunc = cfg.get("aggfunc", [])

   
    # Create the pivot table
    outputDataFrame = inputDataFrame.pivot_table(
        values=values,
        index=index,
        columns=columns,
        aggfunc=aggfunc if aggfunc else "mean",
    )

    
    # Flatten MultiIndex columns
    if isinstance(outputDataFrame.columns, pd.MultiIndex):
        outputDataFrame.columns = [
            "_".join(map(str, col)).strip("_") for col in outputDataFrame.columns.values
        ]

   
    
    # Reset index if necessary
    outputDataFrame.reset_index(inplace=True)

    return outputDataFrame


def dimensions(cfg, inputDataFrame):
    # calculate all the columns needed for the pivot table calculation

    values = cfg["values"]
    index = cfg["index"]
    columns = cfg["columns"]

    # ensure that the columns are lists
    if not isinstance(values, list):
        values = [values]
    if not isinstance(index, list):
        index = [index]
    if not isinstance(columns, list):
        columns = [columns]

    return values + index + columns
