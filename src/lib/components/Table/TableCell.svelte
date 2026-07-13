<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Text alignment. Match the column's `align`. */
		align?: 'left' | 'center' | 'right';
		children: Snippet;
	}

	let { align = 'left', children }: Props = $props();
</script>

<td class="Table-td" style:text-align={align}>{@render children()}</td>
