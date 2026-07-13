<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { TABLE_KEY, type TableContext } from './context.js';

	interface Props {
		/** Make the header a sort toggle. */
		sortable?: boolean;
		/** Sort key reported in the Table's `sort` state (defaults to nothing —
		 * set it so you know which column is sorted). */
		sortKey?: string;
		/** Text alignment for the header (and, by convention, its column). */
		align?: 'left' | 'center' | 'right';
		/** Fixed column width — a number (px) or any CSS length. */
		width?: number | string;
		/** Allow dragging the column's right edge to resize it. */
		resizable?: boolean;
		children: Snippet;
	}

	let {
		sortable = false,
		sortKey,
		align = 'left',
		width,
		resizable = false,
		children,
	}: Props = $props();

	const ctx = getContext<TableContext>(TABLE_KEY);
	onMount(() => ctx.registerColumn());

	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	const key = $derived(sortKey ?? '');
	const dir = $derived(sortable && ctx.sort?.key === key ? ctx.sort.dir : null);
	const ariaSort = $derived(
		dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : sortable ? 'none' : undefined,
	);

	let th = $state<HTMLElement>();
	// Resize override in px; until dragged the column uses the `width` prop.
	let w = $state<number | undefined>(undefined);
	const resolvedW = $derived(w !== undefined ? `${w}px` : px(width));

	function onResizeDown(event: PointerEvent) {
		event.preventDefault();
		event.stopPropagation();
		const handle = event.currentTarget as HTMLElement;
		handle.setPointerCapture(event.pointerId);
		const startX = event.clientX;
		const startW = th?.getBoundingClientRect().width ?? 0;
		function onMove(move: PointerEvent) {
			w = Math.max(40, Math.round(startW + (move.clientX - startX)));
		}
		function onUp(up: PointerEvent) {
			handle.releasePointerCapture(up.pointerId);
			handle.removeEventListener('pointermove', onMove);
			handle.removeEventListener('pointerup', onUp);
			handle.removeEventListener('pointercancel', onUp);
		}
		handle.addEventListener('pointermove', onMove);
		handle.addEventListener('pointerup', onUp);
		handle.addEventListener('pointercancel', onUp);
	}
	function onResizeKey(event: KeyboardEvent) {
		const current = th?.getBoundingClientRect().width ?? 0;
		const step = event.shiftKey ? 40 : 10;
		if (event.key === 'ArrowLeft') w = Math.max(40, Math.round(current - step));
		else if (event.key === 'ArrowRight') w = Math.round(current + step);
		else return;
		event.preventDefault();
	}
</script>

<th bind:this={th} class="Table-th" style:text-align={align} style:width={resolvedW} aria-sort={ariaSort}>
	{#if sortable}
		<button type="button" class="Table-sort" data-align={align} onclick={() => ctx.toggleSort(key)}>
			<span class="Table-sort-label">{@render children()}</span>
			<span class="Table-sort-icon" data-dir={dir}></span>
		</button>
	{:else}
		{@render children()}
	{/if}
	{#if resizable}
		<button
			type="button"
			class="Table-resize"
			aria-label="Resize column"
			onpointerdown={onResizeDown}
			onkeydown={onResizeKey}
		></button>
	{/if}
</th>
