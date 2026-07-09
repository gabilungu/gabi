<script module lang="ts">
	// Raw SVG markup for every chrome glyph, imported at build time and inlined
	// with {@html}. Each file uses `stroke="currentColor"` so the glyph takes
	// the surrounding text color. Add an icon: drop a .svg here, import it, and
	// add it to `glyphs` — its key joins the `IconName` union automatically.
	import chevron from './chevron.svg?raw';
	import close from './close.svg?raw';
	import search from './search.svg?raw';

	const glyphs = { chevron, close, search };
	export type IconName = keyof typeof glyphs;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Direction = 'up' | 'down' | 'left' | 'right';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Which glyph to render. */
		icon: IconName;
		/** Rendered box — a number (px) or any CSS length. Default: 16. */
		size?: number | string;
		/** Rotate the glyph (chevron points down by default). */
		direction?: Direction;
	}

	let { icon, size = 16, direction = 'down', class: className = '', ...rest }: Props = $props();

	const resolved = $derived(typeof size === 'number' ? `${size}px` : size);
	const rotation: Record<Direction, number> = { down: 0, up: 180, left: 90, right: -90 };
</script>

<span
	{...rest}
	class="InternalIcon {className}"
	style:--size={resolved}
	style:transform="rotate({rotation[direction]}deg)"
	aria-hidden="true"
>
	{@html glyphs[icon]}
</span>

<style>
	.InternalIcon {
		display: inline-flex;
		width: var(--size, 16px);
		height: var(--size, 16px);
		flex-shrink: 0;
	}
	.InternalIcon :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
