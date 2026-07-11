<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {color} --color - Icon color (defaults to the current text color)
	 * @cssvar {number} --weight - Stroke width in stroke mode (from `weight`)
	 */
	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/**
		 * The icon's SVG, given either way:
		 * - a **path** to an SVG served from the static folder — e.g. "/icons/search.svg";
		 * - **raw SVG markup**, e.g. from a `?raw` import: `import svg from './x.svg?raw'`.
		 */
		icon: string;
		/** Size — a number (treated as px) or any CSS length ("20px", "2em"). Default: 16. */
		dimension?: number | string;
		/**
		 * How the icon is painted — its shapes are repainted to follow the current
		 * color. `'stroke'` (default) outlines them at `weight`; `'fill'` fills them.
		 */
		mode?: 'fill' | 'stroke';
		/** Stroke width in `mode="stroke"` — a number or any CSS length. Default: 2. */
		weight?: number | string;
	}

	let {
		icon,
		dimension = 16,
		mode = 'stroke',
		weight = 2,
		class: className = '',
		...rest
	}: Props = $props();

	// A bare number is px; a string is used verbatim.
	const resolved = $derived(
		typeof dimension === 'number' ? `${dimension}px` : dimension,
	);
	const strokeWidth = $derived(
		typeof weight === 'number' ? `${weight}` : weight,
	);

	const isMarkup = (s: string) => !!s && s.trimStart().startsWith('<');

	// The SVG is rendered inline so its paint can be overridden with CSS — the
	// only way to recolor it to currentColor and drive the stroke weight. Raw
	// markup is used as-is; a path is fetched so it can be inlined too.
	let fetched = $state('');
	$effect(() => {
		if (!icon || isMarkup(icon)) return;
		let alive = true;
		fetched = '';
		fetch(new URL(icon, document.baseURI).href)
			.then((r) => r.text())
			.then((t) => {
				if (alive) fetched = t;
			})
			.catch(() => {});
		return () => {
			alive = false;
		};
	});
	const svg = $derived(isMarkup(icon) ? icon : fetched);
</script>

<!--
	The SVG is inlined and repainted via CSS so it follows the surrounding text
	color (currentColor) at any size — the way a monochrome icon should behave.
	Decorative by default (aria-hidden); wrap it with a label where it carries
	meaning.
-->
<span
	{...rest}
	class="Icon {mode} {className}"
	style:width={resolved}
	style:height={resolved}
	style:--weight={strokeWidth}
	aria-hidden="true"
>{@html svg}</span>

<style>
	.Icon {
		display: inline-block;
		flex-shrink: 0;
		vertical-align: -0.15em;
		line-height: 0;
		color: var(--color, currentColor);
	}
	.Icon :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* CSS wins over the SVG's own fill/stroke presentation attributes, so the
	   whole glyph follows the chosen mode. */
	.Icon.fill :global(svg),
	.Icon.fill :global(svg *) {
		fill: currentColor;
		stroke: none;
	}
	.Icon.stroke :global(svg),
	.Icon.stroke :global(svg *) {
		fill: none;
		stroke: currentColor;
		stroke-width: var(--weight, 2);
	}
</style>
