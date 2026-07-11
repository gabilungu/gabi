<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {shorthand} --border - Border shorthand, e.g. `1px solid var(--base-200)` (default: none)
	 * @cssvar {shorthand} --bg - Background shorthand — a colour or an image (default: none)
	 * @cssvar {color} --fg - Text colour; inherited by default.
	 * @cssvar {string} --shadow - Box-shadow, e.g. `0 1px 3px rgb(0 0 0 / 0.1)` (default: none)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Main axis (flex-direction). Default: 'row'. */
		direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
		/** Horizontal placement of the content — stays horizontal whatever the direction. Default: 'left'. */
		// prettier-ignore (single-line union so sdocs generates a select control)
		contentX?: 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly' | 'stretch';
		/** Vertical placement of the content — stays vertical whatever the direction. Default: 'top'. */
		// prettier-ignore (single-line union so sdocs generates a select control)
		contentY?: 'top' | 'center' | 'bottom' | 'between' | 'around' | 'evenly' | 'stretch';
		/** Gap between children — a number (px) or any CSS length. Default: 0. */
		gap?: number | string;
		/** Inner padding — a number (px) or any CSS shorthand. */
		padding?: number | string;
		/** Outer margin — a number (px) or any CSS shorthand. */
		margin?: number | string;
		/** Wrapping (flex-wrap). Default: 'nowrap'. */
		wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
		/** Width: 'fill' (100%), 'hug' (fit content), a number (px), or any CSS
		 * length. Default: 'hug'. */
		width?: 'fill' | 'hug' | number | string;
		/** Grow to fill free space — an equal share (basis 0, min-size 0). Pass a
		 * number for a weighted flex-grow. Default: false. */
		grow?: boolean | number;
		/** Whether the element shrinks when space is tight (flex-shrink). On by
		 * default — the browser default; `shrink={false}` keeps its size. Pass a
		 * number for a weighted ratio. Default: true. */
		shrink?: boolean | number;
		children: Snippet;
	}

	let {
		direction = 'row',
		contentX = 'left',
		contentY = 'top',
		gap = 0,
		padding,
		margin,
		wrap = 'nowrap',
		width = 'hug',
		grow = false,
		shrink = true,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// A number becomes px; a string passes through.
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	// contentX/contentY are physical (horizontal/vertical); which flex property
	// each drives depends on direction. The main axis takes justify-content, the
	// cross axis takes align-items — and the two accept different values, so a
	// distribution value that lands on the cross axis falls back to stretch, and
	// stretch on the main axis falls back to the start.
	const CSS: Record<string, string> = {
		left: 'flex-start',
		top: 'flex-start',
		center: 'center',
		right: 'flex-end',
		bottom: 'flex-end',
		between: 'space-between',
		around: 'space-around',
		evenly: 'space-evenly',
		stretch: 'stretch',
	};
	const forMain = (v: string) => (v === 'stretch' ? 'flex-start' : v);
	const forCross = (v: string) => (v.startsWith('space-') ? 'stretch' : v);

	const isColumn = $derived(direction.startsWith('column'));
	const justifyContent = $derived(forMain(CSS[isColumn ? contentY : contentX]));
	const alignItems = $derived(forCross(CSS[isColumn ? contentX : contentY]));
	const resolvedGap = $derived(px(gap));
	const resolvedWidth = $derived(
		width === 'fill' ? '100%' : width === 'hug' ? 'fit-content' : px(width),
	);

	// grow / shrink accept a boolean (→ 1) or a number (weighted). A growing item
	// also gets basis 0 + min-size 0 so siblings share equally and don't overflow.
	const growing = $derived(!!grow);
	const flexGrow = $derived(typeof grow === 'number' ? `${grow}` : grow ? '1' : undefined);
	const flexShrink = $derived(typeof shrink === 'number' ? `${shrink}` : shrink ? undefined : '0');
</script>

<div
	{...rest}
	class="Flex {className}"
	style:flex-direction={direction}
	style:justify-content={justifyContent}
	style:align-items={alignItems}
	style:flex-wrap={wrap}
	style:gap={resolvedGap}
	style:padding={px(padding)}
	style:margin={px(margin)}
	style:width={resolvedWidth}
	style:flex-grow={flexGrow}
	style:flex-shrink={flexShrink}
	style:flex-basis={growing ? '0' : undefined}
	style:min-width={growing ? '0' : undefined}
	style:min-height={growing ? '0' : undefined}
>
	{@render children()}
</div>

<style>
	.Flex {
		display: flex;
		box-sizing: border-box;
		/* Optional shell — theme via these custom props (Flex has no styling props). */
		border: var(--border, none);
		background: var(--bg, none);
		color: var(--fg, inherit);
		box-shadow: var(--shadow, none);
	}
</style>
