def assert_error_in_annotation(fig, text):

    assert "layout" in fig
    assert "annotations" in fig["layout"]
    matching = [el for el in fig["layout"]["annotations"] if el["text"] == text]
    assert len(matching) > 0