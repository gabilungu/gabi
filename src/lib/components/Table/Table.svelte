<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { TABLE_KEY, type TableContext, type TableSort } from './context.js';

	/**
	 * @cssvar {shorthand} --border - Row / cell divider (default: `1px solid var(--base-150)`)
	 * @cssvar {shorthand} --headerBg - Header background (default: `var(--base-50)`)
	 * @cssvar {shorthand} --rowHoverBg - Row hover background (default: `var(--base-50)`)
	 * @cssvar {shorthand} --stripeBg - Zebra-stripe background when `striped` (default: `var(--base-50)`)
	 * @cssvar {shorthand} --selectedBg - Selected row background (default: `var(--focus-100)`)
	 */
	interface Props extends HTMLTableAttributes {
		/** Show a leading selection checkbox column. */
		selectable?: boolean;
		/** Selected row values (each `Table.Row`'s `value`). Bindable. */
		selected?: unknown[];
		/** Current sort, or null. Bindable — sort your own rows by it. */
		sort?: TableSort | null;
		/** Current page (1-based). Bindable — used by `Table.Pager`. */
		page?: number;
		/** Rows per page. Bindable — used by `Table.Pager`. */
		pageSize?: number;
		/** Zebra-stripe the rows. */
		striped?: boolean;
		/** Scroll region height — a number (px) or CSS length. With it set, the
		 * body scrolls and the header sticks. */
		maxHeight?: number | string;
		children: Snippet;
	}

	let {
		selectable = false,
		selected = $bindable([]),
		sort = $bindable(null),
		page = $bindable(1),
		pageSize = $bindable(10),
		striped = false,
		maxHeight,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	const rowValues = new SvelteSet<unknown>();
	let columnCount = $state(0);

	const selectedSet = $derived(new SvelteSet(selected));

	const allSelected = $derived(
		rowValues.size > 0 && [...rowValues].every((v) => selectedSet.has(v)),
	);
	const someSelected = $derived(
		!allSelected && [...rowValues].some((v) => selectedSet.has(v)),
	);

	const ctx: TableContext = {
		get selectable() {
			return selectable;
		},
		get sort() {
			return sort;
		},
		toggleSort(key) {
			if (!sort || sort.key !== key) sort = { key, dir: 'asc' };
			else if (sort.dir === 'asc') sort = { key, dir: 'desc' };
			else sort = null;
		},
		isSelected(value) {
			return selectedSet.has(value);
		},
		toggle(value) {
			if (selectedSet.has(value)) selected = selected.filter((v) => v !== value);
			else selected = [...selected, value];
		},
		registerRow(value) {
			rowValues.add(value);
			return () => rowValues.delete(value);
		},
		registerColumn() {
			columnCount += 1;
			return () => {
				columnCount -= 1;
			};
		},
		get allSelected() {
			return allSelected;
		},
		get someSelected() {
			return someSelected;
		},
		toggleAll() {
			if (allSelected) {
				selected = selected.filter((v) => !rowValues.has(v));
			} else {
				const add = [...rowValues].filter((v) => !selectedSet.has(v));
				selected = [...selected, ...add];
			}
		},
		get colCount() {
			return columnCount + (selectable ? 1 : 0);
		},
		get page() {
			return page;
		},
		set page(v) {
			page = v;
		},
		get pageSize() {
			return pageSize;
		},
		set pageSize(v) {
			pageSize = v;
		},
	};
	setContext(TABLE_KEY, ctx);
</script>

<div class="Table-scroll {className}" style:max-height={px(maxHeight)}>
	<table {...rest} class="Table" class:Table-striped={striped}>
		{@render children()}
	</table>
</div>

<style>
	.Table-scroll {
		overflow: auto;
		width: 100%;
		box-sizing: border-box;
	}
	.Table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
		font-size: 14px;
		color: var(--fg);
	}

	/* Cells + headers ------------------------------------------------------- */
	.Table :global(.Table-th),
	.Table :global(.Table-td) {
		box-sizing: border-box;
		padding: 10px 12px;
		border-bottom: var(--border, 1px solid var(--base-150));
		vertical-align: middle;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.Table :global(.Table-th) {
		position: sticky;
		top: 0;
		z-index: 1;
		text-align: left;
		font-weight: 600;
		color: var(--fg-l);
		background: var(--headerBg, var(--base-50));
		user-select: none;
	}

	/* Rows ------------------------------------------------------------------ */
	.Table :global(.Table-row) {
		transition: background 0.1s ease;
	}
	.Table :global(.Table-row[data-clickable]) {
		cursor: pointer;
	}
	.Table :global(.Table-row:hover) {
		background: var(--rowHoverBg, var(--base-50));
	}
	.Table-striped :global(.Table-body .Table-row:nth-child(even)) {
		background: var(--stripeBg, var(--base-50));
	}
	.Table :global(.Table-row.Table-selected) {
		background: var(--selectedBg, var(--focus-100));
	}

	/* Selection checkbox column --------------------------------------------- */
	.Table :global(.Table-check) {
		width: 44px;
		padding: 0;
		text-align: center;
	}
	.Table :global(.Table-check input) {
		cursor: pointer;
		margin: 0;
	}

	/* Sortable header -------------------------------------------------------- */
	.Table :global(.Table-sort) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		font-weight: 600;
		color: inherit;
		cursor: pointer;
		text-align: inherit;
	}
	.Table :global(.Table-sort[data-align='right']) {
		justify-content: flex-end;
	}
	.Table :global(.Table-sort[data-align='center']) {
		justify-content: center;
	}
	.Table :global(.Table-sort-label) {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.Table :global(.Table-sort-icon) {
		flex-shrink: 0;
		width: 0;
		height: 0;
		opacity: 0;
	}
	.Table :global(.Table-sort-icon[data-dir='asc']) {
		opacity: 1;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-bottom: 5px solid currentColor;
	}
	.Table :global(.Table-sort-icon[data-dir='desc']) {
		opacity: 1;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-top: 5px solid currentColor;
	}

	/* Column resize handle --------------------------------------------------- */
	/* Sits inside the cell's right edge — the header's `overflow: hidden` (for
	   ellipsis) would clip a handle that straddled the border. */
	.Table :global(.Table-resize) {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: 12px;
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		cursor: col-resize;
		touch-action: none;
		z-index: 2;
	}
	.Table :global(.Table-resize)::before {
		content: '';
		position: absolute;
		top: 20%;
		bottom: 20%;
		right: 3px;
		width: 2px;
		background: transparent;
		transition: background 0.1s ease;
	}
	.Table :global(.Table-resize:hover)::before,
	.Table :global(.Table-resize:focus-visible)::before {
		background: var(--base-300);
	}
	.Table :global(.Table-resize:focus-visible) {
		outline: none;
	}

	/* Pager ------------------------------------------------------------------ */
	.Table :global(.Table-foot) {
		position: sticky;
		bottom: 0;
		z-index: 1;
	}
	.Table :global(.Table-pager-cell) {
		padding: 8px 12px;
		border-bottom: none;
		border-top: var(--border, 1px solid var(--base-150));
		background: var(--headerBg, var(--base-50));
		white-space: normal;
	}
	.Table :global(.Table-pager) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.Table :global(.Table-pager-info),
	.Table :global(.Table-pager-page) {
		font-size: 13px;
		color: var(--fg-l);
	}
	.Table :global(.Table-pager-controls) {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.Table :global(.Table-pager-page) {
		min-width: 52px;
		text-align: center;
	}
</style>
