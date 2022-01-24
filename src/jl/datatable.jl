# AUTO GENERATED FILE - DO NOT EDIT

export datatable

"""
    datatable(;kwargs...)

A DataTable component.
Dash DataTable is an interactive table component designed for
viewing, editing, and exploring large datasets.
DataTable is rendered with standard, semantic HTML <table/> markup,
which makes it accessible, responsive, and easy to style. This
component was written from scratch in React.js specifically for the
Dash community. Its API was designed to be ergonomic and its behavior
is completely customizable through its properties.
Keyword arguments:
- `id` (optional): The ID of the table.
- `active_cell` (optional): The row and column indices and IDs of the currently active cell.
`row_id` is only returned if the data rows have an `id` key.
- `cell_selectable` (optional): If True (default), then it is possible to click and navigate
table cells.
- `column_selectable` (optional): If `single`, then the user can select a single column or group
of merged columns via the radio button that will appear in the
header rows.
If `multi`, then the user can select multiple columns or groups
of merged columns via the checkbox that will appear in the header
rows.
If false, then the user will not be able to select columns and no
input will appear in the header rows.
When a column is selected, its id will be contained in `selected_columns`
and `derived_viewport_selected_columns`.
- `columns` (optional): Columns describes various aspects about each individual column.
`name` and `id` are the only required parameters.
- `css` (optional): The `css` property is a way to embed CSS selectors and rules
onto the page.
We recommend starting with the `style_*` properties
before using this `css` property.
Example:
[
    {"selector": ".dash-spreadsheet", "rule": 'font-family: "monospace"'}
]
- `data` (optional): The contents of the table.
The keys of each item in data should match the column IDs.
Each item can also have an 'id' key, whose value is its row ID. If there
is a column with ID='id' this will display the row ID, otherwise it is
just used to reference the row for selections, filtering, etc.
Example:
[
     {'column-1': 4.5, 'column-2': 'montreal', 'column-3': 'canada'},
     {'column-1': 8, 'column-2': 'boston', 'column-3': 'america'}
]
- `data_previous` (optional): The previous state of `data`. `data_previous`
has the same structure as `data` and it will be updated
whenever `data` changes, either through a callback or
by editing the table.
This is a read-only property: setting this property will not
have any impact on the table.
- `data_timestamp` (optional): The unix timestamp when the data was last edited.
Use this property with other timestamp properties
(such as `n_clicks_timestamp` in `dash_html_components`)
to determine which property has changed within a callback.
- `derived_filter_query_structure` (optional): This property represents the current structure of
`filter_query` as a tree structure. Each node of the
query structure has:
type (string; required):
  'open-block',
  'logical-operator',
  'relational-operator',
  'unary-operator', or
  'expression';
subType (string; optional):
  'open-block': '()',
  'logical-operator': '&&', '||',
  'relational-operator': '=', '>=', '>', '<=', '<', '!=', 'contains',
  'unary-operator': '!', 'is bool', 'is even', 'is nil', 'is num', 'is object', 'is odd', 'is prime', 'is str',
  'expression': 'value', 'field';
value (any):
  'expression, value': passed value,
  'expression, field': the field/prop name.
block (nested query structure; optional).
left (nested query structure; optional).
right (nested query structure; optional).
If the query is invalid or empty, the `derived_filter_query_structure` will
be `None`.
- `derived_viewport_data` (optional): This property represents the current state of `data`
on the current page. This property will be updated
on paging, sorting, and filtering.
- `derived_viewport_indices` (optional): `derived_viewport_indices` indicates the order in which the original
rows appear after being filtered, sorted, and/or paged.
`derived_viewport_indices` contains indices for the current page,
while `derived_virtual_indices` contains indices across all pages.
- `derived_viewport_row_ids` (optional): `derived_viewport_row_ids` lists row IDs in the order they appear
after being filtered, sorted, and/or paged.
`derived_viewport_row_ids` contains IDs for the current page,
while `derived_virtual_row_ids` contains IDs across all pages.
- `derived_viewport_selected_columns` (optional): `derived_viewport_selected_columns` contains the ids of the
`selected_columns` that are not currently hidden.
- `derived_viewport_selected_row_ids` (optional): `derived_viewport_selected_row_ids` represents the IDs of the
`selected_rows` on the currently visible page.
- `derived_viewport_selected_rows` (optional): `derived_viewport_selected_rows` represents the indices of the
`selected_rows` from the perspective of the `derived_viewport_indices`.
- `derived_virtual_data` (optional): This property represents the visible state of `data`
across all pages after the front-end sorting and filtering
as been applied.
- `derived_virtual_indices` (optional): `derived_virtual_indices` indicates the order in which the original
rows appear after being filtered and sorted.
`derived_viewport_indices` contains indices for the current page,
while `derived_virtual_indices` contains indices across all pages.
- `derived_virtual_row_ids` (optional): `derived_virtual_row_ids` indicates the row IDs in the order in which
they appear after being filtered and sorted.
`derived_viewport_row_ids` contains IDs for the current page,
while `derived_virtual_row_ids` contains IDs across all pages.
- `derived_virtual_selected_row_ids` (optional): `derived_virtual_selected_row_ids` represents the IDs of the
`selected_rows` as they appear after filtering and sorting,
across all pages.
- `derived_virtual_selected_rows` (optional): `derived_virtual_selected_rows` represents the indices of the
 `selected_rows` from the perspective of the `derived_virtual_indices`.
- `dropdown` (optional): `dropdown` specifies dropdown options for different columns.
Each entry refers to the column ID.
The `clearable` property defines whether the value can be deleted.
The `options` property refers to the `options` of the dropdown.
- `dropdown_conditional` (optional): `dropdown_conditional` specifies dropdown options in various columns and cells.
This property allows you to specify different dropdowns
depending on certain conditions. For example, you may
render different "city" dropdowns in a row depending on the
current value in the "state" column.
- `dropdown_data` (optional): `dropdown_data` specifies dropdown options on a row-by-row, column-by-column basis.
Each item in the array corresponds to the corresponding dropdowns for the `data` item
at the same index. Each entry in the item refers to the Column ID.
- `editable` (optional): If True, then the data in all of the cells is editable.
When `editable` is True, particular columns can be made
uneditable by setting `editable` to `False` inside the `columns`
property.
If False, then the data in all of the cells is uneditable.
When `editable` is False, particular columns can be made
editable by setting `editable` to `True` inside the `columns`
property.
- `end_cell` (optional): When selecting multiple cells
(via clicking on a cell and then shift-clicking on another cell),
`end_cell` represents the row / column coordinates and IDs of the cell
in one of the corners of the region.
`start_cell` represents the coordinates of the other corner.
- `export_columns` (optional): Denotes the columns that will be used in the export data file.
If `all`, all columns will be used (visible + hidden). If `visible`,
only the visible columns will be used. Defaults to `visible`.
- `export_format` (optional): Denotes the type of the export data file,
Defaults to `'none'`
- `export_headers` (optional): Denotes the format of the headers in the export data file.
If `'none'`, there will be no header. If `'display'`, then the header
of the data file will be be how it is currently displayed. Note that
`'display'` is only supported for `'xlsx'` export_format and will behave
like `'names'` for `'csv'` export format. If `'ids'` or `'names'`,
then the headers of data file will be the column id or the column
names, respectively
- `fill_width` (optional): `fill_width` toggles between a set of CSS for two common behaviors:
True: The table container's width will grow to fill the available space;
False: The table container's width will equal the width of its content.
- `filter_action` (optional): The `filter_action` property controls the behavior of the `filtering` UI.
If `'none'`, then the filtering UI is not displayed.
If `'native'`, then the filtering UI is displayed and the filtering
logic is handled by the table. That is, it is performed on the data
that exists in the `data` property.
If `'custom'`, then the filtering UI is displayed but it is the
responsibility of the developer to program the filtering
through a callback (where `filter_query` or `derived_filter_query_structure` would be the input
and `data` would be the output).
- `filter_options` (optional): There are two `filter_options` props in the table.
This is the table-level filter_options prop and there is
also the column-level `filter_options` prop.
These props determine whether the applicable filter relational
operators will default to `sensitive` or `insensitive` comparison.
If the column-level `filter_options` prop is set it overrides
the table-level `filter_options` prop for that column.
- `filter_query` (optional): If `filter_action` is enabled, then the current filtering
string is represented in this `filter_query`
property.
- `fixed_columns` (optional): `fixed_columns` will "fix" the set of columns so that
they remain visible when scrolling horizontally across
the unfixed columns. `fixed_columns` fixes columns
from left-to-right.
If `headers` is False, no columns are fixed.
If `headers` is True, all operation columns (see `row_deletable` and `row_selectable`)
are fixed. Additional data columns can be fixed by
assigning a number to `data`.

Note that fixing columns introduces some changes to the
underlying markup of the table and may impact the
way that your columns are rendered or sized.
View the documentation examples to learn more.
- `fixed_rows` (optional): `fixed_rows` will "fix" the set of rows so that
they remain visible when scrolling vertically down
the table. `fixed_rows` fixes rows
from top-to-bottom, starting from the headers.
If `headers` is False, no rows are fixed.
If `headers` is True, all header and filter rows (see `filter_action`) are
fixed. Additional data rows can be fixed by assigning
a number to `data`.  Note that fixing rows introduces some changes to the
underlying markup of the table and may impact the
way that your columns are rendered or sized.
View the documentation examples to learn more.
- `hidden_columns` (optional): List of columns ids of the columns that are currently hidden.
See the associated nested prop `columns.hideable`.
- `include_headers_on_copy_paste` (optional): If true, headers are included when copying from the table to different
tabs and elsewhere. Note that headers are ignored when copying from the table onto itself and
between two tables within the same tab.
- `is_focused` (optional): If True, then the `active_cell` is in a focused state.
- `loading_state` (optional): Object that holds the loading state object coming from dash-renderer
- `locale_format` (optional): The localization specific formatting information applied to all columns in the table.
This prop is derived from the [d3.formatLocale](https://github.com/d3/d3-format#formatLocale) data structure specification.
When left unspecified, each individual nested prop will default to a pre-determined value.
- `markdown_options` (optional): The `markdown_options` property allows customization of the markdown cells behavior.
- `merge_duplicate_headers` (optional): If True, then column headers that have neighbors with duplicate names
will be merged into a single cell.
This will be applied for single column headers and multi-column
headers.
- `page_action` (optional): `page_action` refers to a mode of the table where
not all of the rows are displayed at once: only a subset
are displayed (a "page") and the next subset of rows
can viewed by clicking "Next" or "Previous" buttons
at the bottom of the page.
Pagination is used to improve performance: instead of
rendering all of the rows at once (which can be expensive),
we only display a subset of them.
With pagination, we can either page through data that exists
in the table (e.g. page through `10,000` rows in `data` `100` rows at a time)
or we can update the data on-the-fly with callbacks
when the user clicks on the "Previous" or "Next" buttons.
These modes can be toggled with this `page_action` parameter:
`'native'`: all data is passed to the table up-front, paging logic is
handled by the table;
`'custom'`: data is passed to the table one page at a time, paging logic
is handled via callbacks;
`'none'`: disables paging, render all of the data at once.
- `page_count` (optional): `page_count` represents the number of the pages in the
paginated table. This is really only useful when performing
backend pagination, since the front end is able to use the
full size of the table to calculate the number of pages.
- `page_current` (optional): `page_current` represents which page the user is on.
Use this property to index through data in your callbacks with
backend paging.
- `page_size` (optional): `page_size` represents the number of rows that will be
displayed on a particular page when `page_action` is `'custom'` or `'native'`
- `persisted_props` (optional): Properties whose user interactions will persist after refreshing the
component or the page.
- `persistence` (optional): Used to allow user interactions in this component to be persisted when
the component - or the page - is refreshed. If `persisted` is truthy and
hasn't changed from its previous value, any `persisted_props` that the
user has changed while using the app will keep those changes, as long as
the new prop value also matches what was given originally.
Used in conjunction with `persistence_type` and `persisted_props`.
- `persistence_type` (optional): Where persisted user changes will be stored:
memory: only kept in memory, reset on page refresh.
local: window.localStorage, data is kept after the browser quit.
session: window.sessionStorage, data is cleared once the browser quit.
- `row_deletable` (optional): If True, then a `x` will appear next to each `row`
and the user can delete the row.
- `row_selectable` (optional): If `single`, then the user can select a single row
via a radio button that will appear next to each row.
If `multi`, then the user can select multiple rows
via a checkbox that will appear next to each row.
If false, then the user will not be able to select rows
and no additional UI elements will appear.
When a row is selected, its index will be contained
in `selected_rows`.
- `selected_cells` (optional): `selected_cells` represents the set of cells that are selected,
as an array of objects, each item similar to `active_cell`.
Multiple cells can be selected by holding down shift and
clicking on a different cell or holding down shift and navigating
with the arrow keys.
- `selected_columns` (optional): `selected_columns` contains the ids of columns that
are selected via the UI elements that appear when
`column_selectable` is `'single' or 'multi'`.
- `selected_row_ids` (optional): `selected_row_ids` contains the ids of rows that
are selected via the UI elements that appear when
`row_selectable` is `'single'` or `'multi'`.
- `selected_rows` (optional): `selected_rows` contains the indices of rows that
are selected via the UI elements that appear when
`row_selectable` is `'single'` or `'multi'`.
- `setProps` (optional): Dash-assigned callback that gets fired when the user makes changes.
- `sort_action` (optional): The `sort_action` property enables data to be
sorted on a per-column basis.
If `'none'`, then the sorting UI is not displayed.
If `'native'`, then the sorting UI is displayed and the sorting
logic is handled by the table. That is, it is performed on the data
that exists in the `data` property.
If `'custom'`, the the sorting UI is displayed but it is the
responsibility of the developer to program the sorting
through a callback (where `sort_by` would be the input and `data`
would be the output).
Clicking on the sort arrows will update the
`sort_by` property.
- `sort_as_null` (optional): An array of string, number and boolean values that are treated as `None`
(i.e. ignored and always displayed last) when sorting.
This value will be used by columns without `sort_as_null`.
Defaults to `[]`.
- `sort_by` (optional): `sort_by` describes the current state
of the sorting UI.
That is, if the user clicked on the sort arrow
of a column, then this property will be updated
with the column ID and the direction
(`asc` or `desc`) of the sort.
For multi-column sorting, this will be a list of
sorting parameters, in the order in which they were
clicked.
- `sort_mode` (optional): Sorting can be performed across multiple columns
(e.g. sort by country, sort within each country,
 sort by year) or by a single column.
NOTE - With multi-column sort, it's currently
not possible to determine the order in which
the columns were sorted through the UI.
See [https://github.com/plotly/dash-table/issues/170](https://github.com/plotly/dash-table/issues/170)
- `start_cell` (optional): When selecting multiple cells
(via clicking on a cell and then shift-clicking on another cell),
`start_cell` represents the [row, column] coordinates of the cell
in one of the corners of the region.
`end_cell` represents the coordinates of the other corner.
- `style_as_list_view` (optional): If True, then the table will be styled like a list view
and not have borders between the columns.
- `style_cell` (optional): CSS styles to be applied to each individual cell of the table.
This includes the header cells, the `data` cells, and the filter
cells.
- `style_cell_conditional` (optional): Conditional CSS styles for the cells.
This can be used to apply styles to cells on a per-column basis.
- `style_data` (optional): CSS styles to be applied to each individual data cell.
That is, unlike `style_cell`, it excludes the header and filter cells.
- `style_data_conditional` (optional): Conditional CSS styles for the data cells.
This can be used to apply styles to data cells on a per-column basis.
- `style_filter` (optional): CSS styles to be applied to the filter cells.
Note that this may change in the future as we build out a
more complex filtering UI.
- `style_filter_conditional` (optional): Conditional CSS styles for the filter cells.
This can be used to apply styles to filter cells on a per-column basis.
- `style_header` (optional): CSS styles to be applied to each individual header cell.
That is, unlike `style_cell`, it excludes the `data` and filter cells.
- `style_header_conditional` (optional): Conditional CSS styles for the header cells.
This can be used to apply styles to header cells on a per-column basis.
- `style_table` (optional): CSS styles to be applied to the outer `table` container.
This is commonly used for setting properties like the
width or the height of the table.
- `tooltip` (optional): `tooltip` is the column based tooltip configuration applied to all rows. The key is the column
 id and the value is a tooltip configuration.
Example: {i: {'value': i, 'use_with: 'both'} for i in df.columns}
- `tooltip_conditional` (optional): `tooltip_conditional` represents the tooltip shown
for different columns and cells.
This property allows you to specify different tooltips
depending on certain conditions. For example, you may have
different tooltips in the same column based on the value
of a certain data property.
Priority is from first to last defined conditional tooltip
in the list. Higher priority (more specific) conditional
tooltips should be put at the beginning of the list.
- `tooltip_data` (optional): `tooltip_data` represents the tooltip shown
for different columns and cells.
A list of dicts for which each key is
a column id and the value is a tooltip configuration.
- `tooltip_delay` (optional): `tooltip_delay` represents the table-wide delay in milliseconds before
the tooltip is shown when hovering a cell. If set to `None`, the tooltip
will be shown immediately.
Defaults to 350.
- `tooltip_duration` (optional): `tooltip_duration` represents the table-wide duration in milliseconds
during which the tooltip will be displayed when hovering a cell. If
set to `None`, the tooltip will not disappear.
Defaults to 2000.
- `tooltip_header` (optional): `tooltip_header` represents the tooltip shown
for each header column and optionally each header row.
Example to show long column names in a tooltip: {i: i for i in df.columns}.
Example to show different column names in a tooltip: {'Rep': 'Republican', 'Dem': 'Democrat'}.
If the table has multiple rows of headers, then use a list as the value of the
`tooltip_header` items.
- `virtualization` (optional): This property tells the table to use virtualization when rendering.
Assumptions are that:
the width of the columns is fixed;
the height of the rows is always the same; and
runtime styling changes will not affect width and height vs. first rendering
"""
function datatable(; kwargs...)
        available_props = Symbol[:id, :active_cell, :cell_selectable, :column_selectable, :columns, :css, :data, :data_previous, :data_timestamp, :derived_filter_query_structure, :derived_viewport_data, :derived_viewport_indices, :derived_viewport_row_ids, :derived_viewport_selected_columns, :derived_viewport_selected_row_ids, :derived_viewport_selected_rows, :derived_virtual_data, :derived_virtual_indices, :derived_virtual_row_ids, :derived_virtual_selected_row_ids, :derived_virtual_selected_rows, :dropdown, :dropdown_conditional, :dropdown_data, :editable, :end_cell, :export_columns, :export_format, :export_headers, :fill_width, :filter_action, :filter_options, :filter_query, :fixed_columns, :fixed_rows, :hidden_columns, :include_headers_on_copy_paste, :is_focused, :loading_state, :locale_format, :markdown_options, :merge_duplicate_headers, :page_action, :page_count, :page_current, :page_size, :persisted_props, :persistence, :persistence_type, :row_deletable, :row_selectable, :selected_cells, :selected_columns, :selected_row_ids, :selected_rows, :sort_action, :sort_as_null, :sort_by, :sort_mode, :start_cell, :style_as_list_view, :style_cell, :style_cell_conditional, :style_data, :style_data_conditional, :style_filter, :style_filter_conditional, :style_header, :style_header_conditional, :style_table, :tooltip, :tooltip_conditional, :tooltip_data, :tooltip_delay, :tooltip_duration, :tooltip_header, :virtualization]
        wild_props = Symbol[]
        return Component("datatable", "DataTable", "dash_express_components", available_props, wild_props; kwargs...)
end

