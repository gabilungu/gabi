<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {shorthand} --bg - Frame background, seen only through gaps the
	 *   slots don't cover (default: `var(--base-0)`)
	 * @cssvar {shorthand} --topSlotBottomBorder - Divider below the top slot
	 *   (default: `1px solid var(--base-200)`)
	 * @cssvar {shorthand} --rightSlotLeftBorder - Divider left of the right slot
	 *   (default: `1px solid var(--base-200)`)
	 * @cssvar {shorthand} --bottomSlotTopBorder - Divider above the bottom slot
	 *   (default: `1px solid var(--base-200)`)
	 * @cssvar {shorthand} --leftSlotRightBorder - Divider right of the left slot
	 *   (default: `1px solid var(--base-200)`)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Overall width. Default: `100vw`. `fill` → 100% of the container, a
		 * number → pixels, or any CSS length (`80vw`, `60rem`, …) verbatim. */
		width?: 'fill' | number | string;
		/** Overall height. Default: `100vh`. `fill` → 100% of the container, a
		 * number → pixels, or any CSS length verbatim. */
		height?: 'fill' | number | string;
		/** Top bar — spans the full width, hugs its content height. Omit to drop
		 * the row entirely. */
		top?: Snippet;
		/** Left sidebar — fills the height between top and bottom, hugs its
		 * content width. Omit to drop the column. */
		left?: Snippet;
		/** Right sidebar — fills the height between top and bottom, hugs its
		 * content width. Omit to drop the column. */
		right?: Snippet;
		/** Bottom bar — spans the full width, hugs its content height. Omit to
		 * drop the row. */
		bottom?: Snippet;
		/** Center content — fills whatever space the slots leave. */
		children?: Snippet;
	}

	let {
		width = '100vw',
		height = '100vh',
		top,
		left,
		right,
		bottom,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	// "fill" → 100%, a bare number → px, any other string used verbatim.
	const resolve = (v: 'fill' | number | string) =>
		v === 'fill' ? '100%' : typeof v === 'number' ? `${v}px` : v;
</script>

<div
	{...rest}
	class="Shell2 {className}"
	style:width={resolve(width)}
	style:height={resolve(height)}
>
	{#if top}<div class="Shell2-top">{@render top()}</div>{/if}
	{#if left}<div class="Shell2-left">{@render left()}</div>{/if}
	{#if children}<div class="Shell2-main">{@render children()}</div>{/if}
	{#if right}<div class="Shell2-right">{@render right()}</div>{/if}
	{#if bottom}<div class="Shell2-bottom">{@render bottom()}</div>{/if}
</div>

<style>
	.Shell2 {
		box-sizing: border-box;
		display: grid;
		/* Top/bottom rows and left/right columns hug their content; the centre
		   soaks up the slack. */
		grid-template-columns: auto 1fr auto;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'top    top   top'
			'left   main  right'
			'bottom bottom bottom';
		overflow: hidden;
		background: var(--bg, var(--base-0));
	}

	/* Each slot fills its grid cell (grid items stretch by default), so the top
	   bar is full width, the sidebars are full height, and the centre fills the
	   rest. min-* let a cell shrink below its content so overflow scrolls rather
	   than blowing out the frame. Each edge slot draws a divider on the edge that
	   faces the centre; the borders eat into the centre track, so the frame's
	   overall size is unchanged. */
	.Shell2-top {
		grid-area: top;
		min-width: 0;
		border-bottom: var(--topSlotBottomBorder, 1px solid var(--base-200));
	}
	.Shell2-left {
		grid-area: left;
		min-height: 0;
		overflow: auto;
		border-right: var(--leftSlotRightBorder, 1px solid var(--base-200));
	}
	.Shell2-main {
		grid-area: main;
		min-width: 0;
		min-height: 0;
		overflow: auto;
	}
	.Shell2-right {
		grid-area: right;
		min-height: 0;
		overflow: auto;
		border-left: var(--rightSlotLeftBorder, 1px solid var(--base-200));
	}
	.Shell2-bottom {
		grid-area: bottom;
		min-width: 0;
		border-top: var(--bottomSlotTopBorder, 1px solid var(--base-200));
	}
</style>
