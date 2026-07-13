<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { TABLE_KEY, type TableContext } from './context.js';

	interface Props {
		/** Identifies the row for selection (matched against the Table's
		 * `selected`). Required for a selectable table. */
		value?: unknown;
		/** Fires when the row is clicked. */
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let { value, onclick, children }: Props = $props();

	const ctx = getContext<TableContext>(TABLE_KEY);
	// Register so the header's select-all can see this row. An $effect (not
	// onMount) so it survives `value` changes and doesn't hinge on when
	// `selectable` settles.
	$effect(() => {
		if (value === undefined) return;
		return ctx.registerRow(value);
	});

	const selected = $derived(
		ctx.selectable && value !== undefined ? ctx.isSelected(value) : false,
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_click_events_have_key_events -->
<tr
	class="Table-row"
	class:Table-selected={selected}
	data-clickable={onclick ? true : undefined}
	{onclick}
>
	{#if ctx.selectable}
		<td class="Table-td Table-check">
			<input
				type="checkbox"
				checked={value !== undefined && ctx.isSelected(value)}
				onchange={() => value !== undefined && ctx.toggle(value)}
				onclick={(event) => event.stopPropagation()}
				aria-label="Select row"
			/>
		</td>
	{/if}
	{@render children()}
</tr>
