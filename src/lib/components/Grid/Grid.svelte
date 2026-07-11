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
		/** Column count (a number → that many equal columns) or any CSS
		 * grid-template-columns value. Default: 1. */
		columns?: number | string;
		/** Row count (a number → that many equal rows) or any CSS
		 * grid-template-rows value. */
		rows?: number | string;
		/** Gap between cells — a number (px) or any CSS length. Default: 0. */
		gap?: number | string;
		/** Separate row gap — a number (px) or any CSS length. Defaults to `gap`. */
		rowGap?: number | string;
		/** Horizontal placement of items in their cells (justify-items). Default: 'stretch'. */
		contentX?: 'left' | 'center' | 'right' | 'stretch';
		/** Vertical placement of items in their cells (align-items). Default: 'stretch'. */
		contentY?: 'top' | 'center' | 'bottom' | 'stretch';
		/** Width: 'fill' (100%), 'hug' (fit content), a number (px), or any CSS
		 * length. Default: 'fill'. */
		width?: 'fill' | 'hug' | number | string;
		/** Inner padding — a number (px) or any CSS shorthand. */
		padding?: number | string;
		/** Outer margin — a number (px) or any CSS shorthand. */
		margin?: number | string;
		/** Grow to fill free space of a parent flex — an equal share (basis 0,
		 * min-size 0). Pass a number for a weighted flex-grow. Default: false. */
		grow?: boolean | number;
		/** Whether the grid shrinks when space is tight (flex-shrink). On by
		 * default; pass a number for a weighted ratio. Default: true. */
		shrink?: boolean | number;
		children: Snippet;
	}

	let {
		columns = 1,
		rows,
		gap = 0,
		rowGap,
		contentX = 'stretch',
		contentY = 'stretch',
		width = 'fill',
		padding,
		margin,
		grow = false,
		shrink = true,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// A number becomes px; a string passes through.
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	// A number becomes that many equal tracks (minmax(0,1fr) so they can shrink
	// below content); a string is used verbatim.
	const tracks = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `repeat(${v}, minmax(0, 1fr))` : v;

	const JUSTIFY: Record<string, string> = {
		left: 'start',
		center: 'center',
		right: 'end',
		stretch: 'stretch',
	};
	const ALIGN: Record<string, string> = {
		top: 'start',
		center: 'center',
		bottom: 'end',
		stretch: 'stretch',
	};

	const resolvedColumns = $derived(tracks(columns));
	const resolvedRows = $derived(tracks(rows));
	const resolvedGap = $derived(px(gap));
	const resolvedRowGap = $derived(px(rowGap));
	const resolvedWidth = $derived(
		width === 'fill' ? '100%' : width === 'hug' ? 'fit-content' : px(width),
	);

	// grow / shrink work exactly like Flex — for a Grid nested inside a Flex.
	const growing = $derived(!!grow);
	const flexGrow = $derived(typeof grow === 'number' ? `${grow}` : grow ? '1' : undefined);
	const flexShrink = $derived(typeof shrink === 'number' ? `${shrink}` : shrink ? undefined : '0');
</script>

<div
	{...rest}
	class="Grid {className}"
	style:grid-template-columns={resolvedColumns}
	style:grid-template-rows={resolvedRows}
	style:justify-items={JUSTIFY[contentX]}
	style:align-items={ALIGN[contentY]}
	style:gap={resolvedGap}
	style:row-gap={resolvedRowGap}
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
	.Grid {
		display: grid;
		box-sizing: border-box;
		/* Optional shell — theme via these custom props (Grid has no styling props). */
		border: var(--border, none);
		background: var(--bg, none);
		color: var(--fg, inherit);
		box-shadow: var(--shadow, none);
	}
</style>
