<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Columns to span — a number (`span N`) or a raw grid-column value (e.g. `1 / 3`). */
		colSpan?: number | string;
		/** Rows to span — a number (`span N`) or a raw grid-row value. */
		rowSpan?: number | string;
		/** Explicit column to start at (grid-column-start). */
		colStart?: number;
		/** Explicit row to start at (grid-row-start). */
		rowStart?: number;
		/** Horizontal placement of the cell within its area (justify-self). */
		contentX?: 'left' | 'center' | 'right' | 'stretch';
		/** Vertical placement of the cell within its area (align-self). */
		contentY?: 'top' | 'center' | 'bottom' | 'stretch';
		children: Snippet;
	}

	let {
		colSpan,
		rowSpan,
		colStart,
		rowStart,
		contentX,
		contentY,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// A number becomes `span N`; a string is used verbatim.
	const span = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `span ${v}` : v;

	// Combine an optional start line with the span into a grid-column/row value.
	const place = (start: number | undefined, s: string | undefined) =>
		start !== undefined ? (s ? `${start} / ${s}` : `${start}`) : s;

	const JUSTIFY: Record<string, string> = {
		left: 'start',
		center: 'center',
		right: 'end',
		stretch: 'stretch',
	};
	const ALIGN: Record<string, string> = {
		top: 'start',
		center: 'center',
		bottom: 'end',
		stretch: 'stretch',
	};

	const gridColumn = $derived(place(colStart, span(colSpan)));
	const gridRow = $derived(place(rowStart, span(rowSpan)));
</script>

<div
	{...rest}
	class="GridCell {className}"
	style:grid-column={gridColumn}
	style:grid-row={gridRow}
	style:justify-self={contentX ? JUSTIFY[contentX] : undefined}
	style:align-self={contentY ? ALIGN[contentY] : undefined}
>
	{@render children()}
</div>

<style>
	.GridCell {
		box-sizing: border-box;
		min-width: 0;
	}
</style>
