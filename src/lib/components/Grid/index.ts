import Root from './Grid.svelte';
import Cell from './Cell.svelte';

const Grid = Object.assign(Root, { Cell });
export { Grid, Cell };
export default Grid;
