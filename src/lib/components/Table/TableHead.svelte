<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { TABLE_KEY, type TableContext } from './context.js';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const ctx = getContext<TableContext>(TABLE_KEY);

	let checkbox = $state<HTMLInputElement>();
	$effect(() => {
		if (checkbox) checkbox.indeterminate = ctx.someSelected;
	});
</script>

<thead class="Table-head">
	<tr>
		{#if ctx.selectable}
			<th class="Table-th Table-check">
				<input
					bind:this={checkbox}
					type="checkbox"
					checked={ctx.allSelected}
					onchange={() => ctx.toggleAll()}
					aria-label="Select all rows"
				/>
			</th>
		{/if}
		{@render children()}
	</tr>
</thead>
