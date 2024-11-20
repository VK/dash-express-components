class BaseTransform:
    def __init__(self, name):
        self.name = name

    def compute(self, cfg, inputDataFrame):
        return inputDataFrame
    
    def dimensions(self, cfg, inputDataFrame):
        return inputDataFrame.columns.tolist()
    
    def get_meta(self, cfg, metaData):
        return metaData

