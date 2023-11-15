import os

# Path to the generated Python file
python_file_path = './dash_express_components/Graph.py'

# Read the contents of the generated Python file
with open(python_file_path, 'r') as file:
    lines = file.readlines()

# Find the line number containing __init__
init_line_number = next(
    (i for i, line in enumerate(lines) if "__init__(" in line), None
)

# check if the next line contains the comment plotApiPatch
if "with plotApiPatch" in lines[init_line_number - 2]:
    print("plotApiPatch already applied")
else:

    # Insert the patch coment before the __init__ function
    lines.insert(init_line_number - 2,"""        # with plotApiPatch
""")

    lines.insert(4,"""
import os
dash_url_base_pathname = os.environ.get("DASH_URL_BASE_PATHNAME", "/")
dash_base_plot_api = os.environ.get("DASH_URL_BASE_PATHNAME", "plotApi")
defaultPlotApi = dash_url_base_pathname + dash_base_plot_api
""",
    )

    lines.append("""
        if not hasattr(self, "plotApi"):
            setattr(self, "plotApi", defaultPlotApi)
                 """)



    # Write the new contents to the file
    with open(python_file_path, 'w') as file:
        file.writelines(lines)

    print("plotApiPatch applied")

