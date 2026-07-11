<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {color} --color - Line colour (default: var(--base-200))
	 */
	interface Props extends HTMLAttributes<HTMLHRElement> {
		/** Orientation of the rule. Default: 'horizontal'. */
		direction?: 'horizontal' | 'vertical';
		/** Line thickness — a number (px) or any CSS length. Default: 1. */
		thickness?: number | string;
		/** Margin across the rule — top/bottom for horizontal, left/right for
		 * vertical. A number (px) or any CSS length. */
		margin?: number | string;
	}

	let {
		direction = 'horizontal',
		thickness = 1,
		margin,
		class: className = '',
		...rest
	}: Props = $props();

	const resolvedThickness = $derived(
		typeof thickness === 'number' ? `${thickness}px` : thickness,
	);
	const resolvedMargin = $derived(typeof margin === 'number' ? `${margin}px` : margin);
</script>

<hr
	{...rest}
	class="Divider {className}"
	data-direction={direction}
	aria-orientation={direction}
	style:--_thickness={resolvedThickness}
	style:--_margin={resolvedMargin}
/>

<style>
	.Divider {
		flex-shrink: 0;
		border: none;
		margin: 0;
		/* Colour it with --color; defaults to the neutral surface line. */
		background: var(--color, var(--base-200));
	}
	/* margin sits across the rule: top/bottom for horizontal, left/right for vertical. */
	.Divider[data-direction='horizontal'] {
		width: 100%;
		height: var(--_thickness);
		margin-block: var(--_margin, 0);
	}
	/* A vertical rule fills its (flex/grid) parent's cross size. */
	.Divider[data-direction='vertical'] {
		width: var(--_thickness);
		align-self: stretch;
		margin-inline: var(--_margin, 0);
	}
</style>
