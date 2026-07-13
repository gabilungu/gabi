import Root from './Table.svelte';
import Head from './TableHead.svelte';
import Column from './TableColumn.svelte';
import Body from './TableBody.svelte';
import Row from './TableRow.svelte';
import Cell from './TableCell.svelte';
import Pager from './TablePager.svelte';

/** Composable data table. Attach the parts: `Table.Head`, `Table.Column`,
 * `Table.Body`, `Table.Row`, `Table.Cell`, `Table.Pager`. */
const Table = Object.assign(Root, { Head, Column, Body, Row, Cell, Pager });
export { Table, Head, Column, Body, Row, Cell, Pager };
export default Table;
