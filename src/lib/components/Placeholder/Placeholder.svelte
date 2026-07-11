<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {length} --padding - Inner padding around the box.
	 * @cssvar {color} --bg - Box background. Default: var(--accent-100).
	 * @cssvar {color} --fg - Text colour. Default: var(--accent-500).
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Text shown centered in the box. Default: "Placeholder". */
		text?: string;
		/** How wide the box is: fill takes the full container width, hug shrinks to the content, a number is pixels, or any CSS length like 100px or 3em. */
		width?: 'fill' | 'hug' | number | string;
		/** How tall the box is: fill takes the full container height, hug shrinks to the content, a number is pixels, or any CSS length like 100px or 3em. */
		height?: 'fill' | 'hug' | number | string;
		/** Corner radius — a number (px) or any CSS length. */
		radius?: number | string;
	}

	let { text = 'Placeholder', width = 'fill', height = 'hug', radius, class: className, ...rest }: Props = $props();

	// "fill" → 100%, "hug" → fit-content, a bare number → px, any other string used verbatim.
	function resolve(size: 'fill' | 'hug' | number | string): string {
		if (size === 'fill') return '100%';
		if (size === 'hug') return 'fit-content';
		return typeof size === 'number' ? `${size}px` : size;
	}

	const w = $derived(resolve(width));
	const h = $derived(resolve(height));
	const r = $derived(
		radius === undefined ? undefined : typeof radius === 'number' ? `${radius}px` : radius,
	);
</script>

<div class={['Placeholder', className]} style:width={w} style:height={h} style:border-radius={r} {...rest}>
	{text}
</div>

<style>
	.Placeholder {
		/* Isolate our own custom props: reset any --bg/--fg/--padding inherited
		   from an ancestor (e.g. a Container that sets --bg) so our defaults hold.
		   A value set directly on the Placeholder still wins — inline style beats
		   this rule. */
		--bg: initial;
		--fg: initial;
		--padding: initial;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: var(--padding, 8px);
		overflow: hidden;
		color: var(--fg, var(--accent-500));
		background: var(--bg, var(--accent-100));
		font-family: var(--font-sans);
		font-size: 12px;
		line-height: 1.4;
		text-align: center;
	}
</style>
