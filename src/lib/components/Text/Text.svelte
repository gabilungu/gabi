<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {color} --color - Text colour; overrides the variant's default colour.
	 */
	interface Props extends HTMLAttributes<HTMLElement> {
		/** Type preset — sets font size, weight, line height, and a default colour.
		 * Every other prop overrides it. Default: 'body'. */
		// prettier-ignore (single-line union so sdocs generates a select control)
		variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'important' | 'small' | 'caption';
		/** Element to render. Defaults to a sensible tag for the variant
		 * (h1–h6 → the heading, body/important/small → `<p>`, caption → `<span>`). */
		// prettier-ignore (single-line union so sdocs generates a select control)
		as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		/** Font size — a number (px) or any CSS length. Overrides the variant. */
		size?: number | string;
		/** Font weight — a number or keyword. Overrides the variant. */
		weight?: number | string;
		/** Line height — a unitless number (e.g. 1.5) or any CSS value. Overrides the variant. */
		lineHeight?: number | string;
		/** Font family. Overrides the default (`var(--font-sans)`). */
		family?: string;
		/** Width: 'auto' (natural — a span hugs its text, a block-level element
		 * fills), 'fill' (100%), a number (px), or any CSS length. Default: 'auto'. */
		width?: 'auto' | 'fill' | number | string;
		children: Snippet;
	}

	let {
		variant = 'body',
		as,
		size,
		weight,
		lineHeight,
		family,
		width = 'auto',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const AS_DEFAULT: Record<string, string> = {
		h1: 'h1',
		h2: 'h2',
		h3: 'h3',
		h4: 'h4',
		h5: 'h5',
		h6: 'h6',
		body: 'p',
		important: 'p',
		small: 'p',
		caption: 'span',
	};
	const tag = $derived(as ?? AS_DEFAULT[variant]);

	// A number becomes px; a string passes through; undefined stays unset.
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	const resolvedSize = $derived(px(size));
	const resolvedWeight = $derived(weight === undefined ? undefined : `${weight}`);
	const resolvedLineHeight = $derived(lineHeight === undefined ? undefined : `${lineHeight}`);
	const resolvedWidth = $derived(
		width === 'auto' ? undefined : width === 'fill' ? '100%' : px(width),
	);
	// `auto` keeps the element's native display (span hugs, block fills); any set
	// width switches to inline-block so even a span honours it.
	const resolvedDisplay = $derived(width === 'auto' ? undefined : 'inline-block');
</script>

<svelte:element
	this={tag}
	{...rest}
	class="Text {className}"
	data-variant={variant}
	style:font-size={resolvedSize}
	style:font-weight={resolvedWeight}
	style:line-height={resolvedLineHeight}
	style:font-family={family}
	style:width={resolvedWidth}
	style:display={resolvedDisplay}
>
	{@render children()}
</svelte:element>

<style>
	.Text {
		box-sizing: border-box;
		margin: 0;
		font-family: var(--font-sans);
	}

	/* Variant presets — font size / weight / line height / default colour. Each is
	   overridden by the matching prop (inline style), and the colour by --color. */
	.Text[data-variant='h1'] {
		font-size: 36px;
		font-weight: 700;
		line-height: 1.2;
		color: var(--color, var(--accent-600));
	}
	.Text[data-variant='h2'] {
		font-size: 30px;
		font-weight: 700;
		line-height: 1.25;
		color: var(--color, var(--accent-600));
	}
	.Text[data-variant='h3'] {
		font-size: 24px;
		font-weight: 700;
		line-height: 1.3;
		color: var(--color, var(--accent-550));
	}
	.Text[data-variant='h4'] {
		font-size: 20px;
		font-weight: 600;
		line-height: 1.35;
		color: var(--color, var(--accent-550));
	}
	.Text[data-variant='h5'] {
		font-size: 18px;
		font-weight: 600;
		line-height: 1.4;
		color: var(--color, var(--accent-500));
	}
	.Text[data-variant='h6'] {
		font-size: 16px;
		font-weight: 600;
		line-height: 1.45;
		color: var(--color, var(--accent-500));
	}
	.Text[data-variant='body'] {
		font-size: 14px;
		font-weight: 400;
		line-height: 1.6;
		color: var(--color, var(--base-700));
	}
	.Text[data-variant='important'] {
		font-size: 16px;
		font-weight: 400;
		line-height: 1.6;
		color: var(--color, var(--base-800));
	}
	.Text[data-variant='small'] {
		font-size: 13px;
		font-weight: 400;
		line-height: 1.55;
		color: var(--color, var(--base-500));
	}
	.Text[data-variant='caption'] {
		font-size: 12px;
		font-weight: 400;
		line-height: 1.5;
		color: var(--color, var(--base-400));
	}
</style>
