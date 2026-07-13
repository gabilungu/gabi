<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {shorthand} --border - Border shorthand, e.g. `1px solid var(--base-100)` (default: none)
	 * @cssvar {shorthand} --bg - Background shorthand — a colour or an image, e.g. `var(--action-100)` or `url(/placeholder.png) center / cover no-repeat` (default: none)
	 * @cssvar {string} --shadow - Box-shadow, e.g. `0 1px 3px rgb(0 0 0 / 0.1)` (default: none)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Inner padding — a number (px) or any CSS shorthand. */
		padding?: number | string;
		/** Gap between children — a number (px) or any CSS length. */
		gap?: number | string;
		/** Corner radius — a number (px) or any CSS length. */
		radius?: number | string;
		/** Outer margin — a number (px) or any CSS shorthand. */
		margin?: number | string;
		/** Width: 'hug' (fit content), 'fill' (100%), a number (px), or any CSS
		 * length. Default: 'fill'. */
		width?: 'hug' | 'fill' | number | string;
		/** Height: 'hug' (fit content), 'fill' (100%), a number (px), or any CSS
		 * length. Default: 'hug'. */
		height?: 'hug' | 'fill' | number | string;
		minWidth?: number | string;
		maxWidth?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;
		/** Flex direction of the children. Default: 'column'. */
		flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
		children?: Snippet;
	}

	let {
		padding,
		gap,
		radius,
		margin,
		width = 'fill',
		height = 'hug',
		minWidth,
		maxWidth,
		minHeight,
		maxHeight,
		flexDirection = 'column',
		children,
		class: className = '',
		...rest
	}: Props = $props();

	/** A number becomes px; a string passes through. */
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	/** Sizing keywords resolve to CSS; numbers become px; strings pass through. */
	const size = (v: 'hug' | 'fill' | number | string | undefined) =>
		v === 'hug' ? 'fit-content' : v === 'fill' ? '100%' : px(v);
</script>

<div
	{...rest}
	class="Container {className}"
	style:padding={px(padding)}
	style:gap={px(gap)}
	style:border-radius={px(radius)}
	style:margin={px(margin)}
	style:width={size(width)}
	style:height={size(height)}
	style:min-width={px(minWidth)}
	style:max-width={px(maxWidth)}
	style:min-height={px(minHeight)}
	style:max-height={px(maxHeight)}
	style:flex-direction={flexDirection}
>
	{@render children?.()}
</div>

<style>
	.Container {
		display: flex;
		box-sizing: border-box;
		/* Style the shell with these custom props — each is a raw CSS value. */
		border: var(--border, none);
		background: var(--bg, none);
		box-shadow: var(--shadow, none);
	}
</style>
