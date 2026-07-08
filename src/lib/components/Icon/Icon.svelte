<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {color} --color - Icon color (defaults to the current text color)
	 * @cssvar {length} --size - Resolved width and height (from `dimension`)
	 */
	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Route to the SVG, served from the static folder — e.g. "/icons/search.svg". */
		path: string;
		/** Size — a number (treated as px) or any CSS length ("20px", "2em"). Default: 16. */
		dimension?: number | string;
		/** Accessible label. Omit for a decorative icon (hidden from assistive tech). */
		label?: string;
	}

	let {
		path,
		dimension = 16,
		label,
		class: className = '',
		...rest
	}: Props = $props();

	// A bare number is px; a string is used verbatim.
	const resolved = $derived(
		typeof dimension === 'number' ? `${dimension}px` : dimension,
	);

	// Relative url() values inside a custom property resolve against the
	// stylesheet that USES the var — in a production build that's the emitted
	// css asset, not the page. Resolving to an absolute URL here makes the
	// mask immune to where the stylesheet lives (and to deploy sub-paths).
	const resolvedPath = $derived(
		typeof document === 'undefined' ? path : new URL(path, document.baseURI).href,
	);
</script>

<!--
	Rendered as a CSS mask, not an <img>, so the icon takes the surrounding
	text color (currentColor) and any size — the way a monochrome icon should
	behave. The SVG's own colors are ignored; only its shape is used.
-->
<span
	{...rest}
	class="Icon {className}"
	style:--icon="url('{resolvedPath}')"
	style:--size={resolved}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
></span>

<style>
	.Icon {
		display: inline-block;
		width: var(--size, 16px);
		height: var(--size, 16px);
		background-color: var(--color, currentColor);
		-webkit-mask: var(--icon) no-repeat center / contain;
		mask: var(--icon) no-repeat center / contain;
		flex-shrink: 0;
		vertical-align: -0.15em;
	}
</style>
