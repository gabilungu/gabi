<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Width: 'fill' (100% of the container — the default), a number (px),
		 * or any CSS length. */
		width?: 'fill' | number | string;
		/** Inner padding — a number (px) or any CSS shorthand. */
		padding?: number | string;
		/** Outer margin — a number (px) or any CSS shorthand. */
		margin?: number | string;
		children?: Snippet;
		class?: string;
	}

	let { width = 'fill', padding, margin, children, class: className = '' }: Props = $props();

	// A number becomes px; a string passes through.
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	const resolvedWidth = $derived(width === 'fill' ? '100%' : px(width));
</script>

<nav
	class="NavTree {className}"
	style:width={resolvedWidth}
	style:padding={px(padding)}
	style:margin={px(margin)}
>
	{#if children}
		{@render children()}
	{/if}
</nav>

<style>
	.NavTree {
		box-sizing: border-box;
		min-width: 0;
		font-size: 13px;
		line-height: 1.4;
		color: var(--font-color, var(--fg));
		display: flex;
		flex-direction: column;
		gap: 1px;
		border-radius: var(--r, 0);
		border: var(--b, none);
	}
</style>
