<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import Icon from '../Icon/Icon.svelte';
	import { TABS_KEY, type TabsContext } from './context.js';

	interface Props {
		/** Identifies the tab; matches a `Tabs.Panel`'s `value` and the Tabs `value`. */
		value: string;
		disabled?: boolean;
		/** Leading icon — a path to an SVG or raw SVG markup. */
		icon?: string;
		children: Snippet;
	}

	let { value, disabled = false, icon, children }: Props = $props();

	const ctx = getContext<TabsContext>(TABS_KEY);
	// Register so the first tab activates when nothing is selected yet.
	$effect(() => {
		ctx.registerTab(value);
	});

	const selected = $derived(ctx.value === value);
	const iconSize = $derived(({ xs: 14, sm: 16, md: 16, lg: 18 })[ctx.size]);
</script>

<button
	type="button"
	class="Tabs-tab"
	role="tab"
	aria-selected={selected}
	tabindex={selected ? 0 : -1}
	{disabled}
	onclick={() => ctx.select(value)}
>
	{#if icon}<Icon {icon} dimension={iconSize} />{/if}
	{@render children()}
</button>
