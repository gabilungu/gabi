export const TABLE_KEY = Symbol('gabi-table');

export interface TableSort {
	key: string;
	dir: 'asc' | 'desc';
}

/** Shared state + coordination the Table root exposes to its sub-components. */
export interface TableContext {
	/** Whether a leading selection checkbox column is shown. */
	readonly selectable: boolean;
	/** Current sort, or null. */
	readonly sort: TableSort | null;
	/** Cycle a column's sort: none → asc → desc → none. */
	toggleSort(key: string): void;
	/** Selection helpers (keyed by each row's `value`). */
	isSelected(value: unknown): boolean;
	toggle(value: unknown): void;
	/** A row registers its value so the header's select-all can see it. Returns
	 * an unregister function for when the row unmounts. */
	registerRow(value: unknown): () => void;
	/** A column registers itself so the pager can span every column. */
	registerColumn(): () => void;
	readonly allSelected: boolean;
	readonly someSelected: boolean;
	toggleAll(): void;
	/** Number of columns, including the checkbox column when selectable. */
	readonly colCount: number;
	/** Pager state (1-based page). */
	page: number;
	pageSize: number;
}
