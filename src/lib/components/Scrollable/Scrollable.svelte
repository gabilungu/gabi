<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {shorthand} --border - Border shorthand, e.g. `1px solid var(--base-200)` (default: none)
	 * @cssvar {shorthand} --bg - Background shorthand — a colour or an image (default: none)
	 * @cssvar {string} --shadow - Box-shadow, e.g. `0 1px 3px rgb(0 0 0 / 0.1)` (default: none)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Width: 'fill' (100%), 'hug' (fit content), a number (px), or any CSS
		 * length. Default: 'fill'. */
		width?: 'fill' | 'hug' | number | string;
		/** Height: 'fill' (100%), 'hug' (fit content), a number (px), or any CSS
		 * length. Default: 'fill'. */
		height?: 'fill' | 'hug' | number | string;
		/** Max width — a number (px) or any CSS length. */
		maxWidth?: number | string;
		/** Max height — a number (px) or any CSS length. With `height='hug'` the box
		 * grows with its content up to this, then scrolls. */
		maxHeight?: number | string;
		/** Horizontal overflow. Default: 'hidden'. */
		overflowX?: 'auto' | 'scroll' | 'hidden' | 'visible';
		/** Vertical overflow — scrolls once the content is taller than the box. Default: 'auto'. */
		overflowY?: 'auto' | 'scroll' | 'hidden' | 'visible';
		/** Flex direction of the children. Default: 'column'. */
		direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
		/** Gap between children — a number (px) or any CSS length. */
		gap?: number | string;
		/** Inner padding — a number (px) or any CSS shorthand. */
		padding?: number | string;
		/** Outer margin — a number (px) or any CSS shorthand. */
		margin?: number | string;
		children: Snippet;
	}

	let {
		width = 'fill',
		height = 'fill',
		maxWidth,
		maxHeight,
		overflowX = 'hidden',
		overflowY = 'auto',
		direction = 'column',
		gap,
		padding,
		margin,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// A number becomes px; a string passes through.
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;
	// 'fill' → 100%, 'hug' → fit-content, else a number (px) or verbatim string.
	const size = (v: 'fill' | 'hug' | number | string) =>
		v === 'fill' ? '100%' : v === 'hug' ? 'fit-content' : px(v);

	const resolvedWidth = $derived(size(width));
	const resolvedHeight = $derived(size(height));
</script>

<div
	{...rest}
	class="Scrollable {className}"
	style:width={resolvedWidth}
	style:height={resolvedHeight}
	style:max-width={px(maxWidth)}
	style:max-height={px(maxHeight)}
	style:overflow-x={overflowX}
	style:overflow-y={overflowY}
	style:flex-direction={direction}
	style:gap={px(gap)}
	style:padding={px(padding)}
	style:margin={px(margin)}
>
	{@render children()}
</div>

<style>
	.Scrollable {
		display: flex;
		box-sizing: border-box;
		/* min-size 0 lets it shrink (and so scroll) inside a flex parent. */
		min-width: 0;
		min-height: 0;
		/* Keep a nested scroller from chaining its scroll out to the page. */
		overscroll-behavior: contain;
		/* Optional shell — theme via these custom props (Scrollable adds behaviour,
		   not looks). */
		border: var(--border, none);
		background: var(--bg, none);
		box-shadow: var(--shadow, none);
	}

	/* Children keep their size instead of flex-shrinking to fit, so the content
	   overflows and scrolls rather than collapsing. */
	.Scrollable > :global(*) {
		flex-shrink: 0;
	}
</style>
