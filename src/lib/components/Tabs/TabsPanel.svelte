<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { TABS_KEY, type TabsContext } from './context.js';

	interface Props {
		/** Matches the `Tabs.Tab` that reveals this panel. */
		value: string;
		children: Snippet;
	}

	let { value, children }: Props = $props();

	const ctx = getContext<TabsContext>(TABS_KEY);
	const active = $derived(ctx.value === value);
</script>

{#if active}
	<div class="Tabs-panel" role="tabpanel" tabindex="0">{@render children()}</div>
{/if}
