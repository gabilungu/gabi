<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {length} --padding - Inner padding around the box.
	 * @cssvar {color} --background - Box background. Default: var(--focus).
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Text shown centered in the box. Default: "Placeholder". */
		text?: string;
		/** How wide the box is: fill takes the full container width, hug shrinks to the content, a number is pixels, or any CSS length like 100px or 3em. */
		width?: 'fill' | 'hug' | number | string;
		/** How tall the box is: fill takes the full container height, hug shrinks to the content, a number is pixels, or any CSS length like 100px or 3em. */
		height?: 'fill' | 'hug' | number | string;
	}

	let { text = 'Placeholder', width = 'fill', height = 'hug', class: className, ...rest }: Props = $props();

	// "fill" → 100%, "hug" → fit-content, a bare number → px, any other string used verbatim.
	function resolve(size: 'fill' | 'hug' | number | string): string {
		if (size === 'fill') return '100%';
		if (size === 'hug') return 'fit-content';
		return typeof size === 'number' ? `${size}px` : size;
	}

	const w = $derived(resolve(width));
	const h = $derived(resolve(height));
</script>

<div class={['Placeholder', className]} style:width={w} style:height={h} {...rest}>{text}</div>

<style>
	.Placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: var(--padding, 8px);
		overflow: hidden;
		color: var(--fg-100);
		background: var(--background, var(--focus));
		font-family: var(--font-sans);
		font-size: 14px;
		line-height: 1.4;
		text-align: center;
	}
</style>
