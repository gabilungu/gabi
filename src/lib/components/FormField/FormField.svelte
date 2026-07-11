<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../Icon/Icon.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Label above the control. */
		label?: string;
		/** Show a red asterisk after the label. */
		required?: boolean;
		/** Secondary text beside the label — e.g. "Optional". Sits at the right. */
		rightText?: string;
		/** Helper text below the control, on the left. */
		leftHelperText?: string;
		/** Icon before the left helper text — a path to an SVG in /static, or raw
		 * SVG markup (like the Icon component). */
		leftHelperIcon?: string;
		/** Helper text below the control, on the right — e.g. a character counter. */
		rightHelperText?: string;
		/** Icon before the right helper text (path or raw SVG). */
		rightHelperIcon?: string;
		/** Colours the helper text (and its icon). Set `danger` with a message in a
		 * helper text to flag an invalid field; pair it with the control's own
		 * `intent`. Default: 'default'. */
		intent?: 'default' | 'success' | 'warning' | 'danger';
		/** Text scale for the label / helper text. Pair with a same-size control
		 * for consistent vertical rhythm. Default: 'md'. */
		size?: 'xs' | 'sm' | 'md' | 'lg';
		/** Width: 'fill' (100%), 'hug' (fit content), a number (px), or any CSS
		 * length. Default: 'fill'. */
		width?: 'fill' | 'hug' | number | string;
		/** Height: 'hug' (fit content), 'fill' (stretch to the row so several
		 * fields line up — the control grows to fill it), a number (px), or any CSS
		 * length. Default: 'hug'. */
		height?: 'fill' | 'hug' | number | string;
		/** Vertical position of the control when the field has spare height (a
		 * fixed or `fill` height): 'top', 'centered' (default), or 'bottom'. */
		contentY?: 'top' | 'centered' | 'bottom';
		/** Dim the label and helper text. */
		disabled?: boolean;
		/** The single form control (Input / Select / Textarea …). */
		children: Snippet;
	}

	let {
		label,
		required = false,
		rightText,
		leftHelperText,
		leftHelperIcon,
		rightHelperText,
		rightHelperIcon,
		intent = 'default',
		size = 'md',
		width = 'fill',
		height = 'hug',
		contentY = 'centered',
		disabled = false,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	// A number becomes px; a string passes through.
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;
	// Sizing keywords resolve to CSS; numbers become px; strings pass through.
	const dim = (v: 'fill' | 'hug' | number | string | undefined) =>
		v === 'fill' ? '100%' : v === 'hug' ? 'fit-content' : px(v);

	// A `fill` height stretches the field to its flex row (via align-self) so
	// several fields match the tallest; every other height is applied directly.
	const fillHeight = $derived(height === 'fill');
	const resolvedHeight = $derived(height === 'fill' ? undefined : dim(height));

	const iconSize = $derived(({ xs: 13, sm: 14, md: 15, lg: 16 })[size]);
	const hasHelperRow = $derived(!!leftHelperText || !!rightHelperText);
</script>

<div
	{...rest}
	class="FormField {className}"
	data-size={size}
	data-intent={intent}
	data-disabled={disabled || undefined}
	data-fill-height={fillHeight || undefined}
	data-content-y={contentY}
	style:width={dim(width)}
	style:height={resolvedHeight}
>
	{#if label}
		<div class="label-row">
			<span class="label"
				>{label}{#if required}<span class="required" aria-hidden="true">*</span>{/if}</span
			>
			{#if rightText}<span class="right-text">{rightText}</span>{/if}
		</div>
	{/if}

	<div class="control">
		{@render children()}
	</div>

	{#if hasHelperRow}
		<div class="helper-row">
			<span class="helper">
				{#if leftHelperText}
					{#if leftHelperIcon}<Icon icon={leftHelperIcon} dimension={iconSize} />{/if}
					<span>{leftHelperText}</span>
				{/if}
			</span>
			{#if rightHelperText}
				<span class="helper right">
					{#if rightHelperIcon}<Icon icon={rightHelperIcon} dimension={iconSize} />{/if}
					<span>{rightHelperText}</span>
				</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.FormField {
		display: flex;
		flex-direction: column;
		gap: var(--_gap, 6px);
		box-sizing: border-box;
		min-width: 0;
		font-family: inherit;
	}
	/* `height="fill"` stretches the field to its flex row (matching the tallest);
	   the control slot then grows and pushes the helper row to the bottom. */
	.FormField[data-fill-height] {
		align-self: stretch;
	}

	.label-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}
	.label {
		font-size: var(--_label-fs, 14px);
		font-weight: 500;
		color: var(--base-700);
		line-height: 1.3;
	}
	.required {
		margin-left: 2px;
		color: var(--danger-500);
	}
	/* The label hint always sits at the right edge of the label row. */
	.right-text {
		margin-left: auto;
		font-size: var(--_helper-fs, 12px);
		font-weight: 400;
		color: var(--base-600);
	}

	/* One control child, stretched to the field's width — and grown to fill a
	   fixed/`fill` height, so the helper row is pushed to the bottom. */
	.control {
		display: grid;
		flex: 1 1 auto;
		min-height: 0;
	}
	/* Where the control sits when the field has spare height. */
	.FormField[data-content-y='top'] .control {
		align-items: start;
	}
	.FormField[data-content-y='centered'] .control {
		align-items: center;
	}
	.FormField[data-content-y='bottom'] .control {
		align-items: end;
	}

	.helper-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}
	.helper {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: var(--base-500);
		font-size: var(--_helper-fs, 12px);
		line-height: 1.4;
	}
	/* The right helper (e.g. a counter) never wraps under the left text. */
	.helper.right {
		flex-shrink: 0;
	}

	/* Intent colours the helper text — and its icon, via currentColor. */
	.FormField[data-intent='success'] .helper {
		color: var(--success-600);
	}
	.FormField[data-intent='warning'] .helper {
		color: var(--warning-700);
	}
	.FormField[data-intent='danger'] .helper {
		color: var(--danger-600);
	}

	/* Size scale — label / helper text and the row gap. */
	.FormField[data-size='xs'] {
		--_label-fs: 12px;
		--_helper-fs: 11px;
		--_gap: 4px;
	}
	.FormField[data-size='sm'] {
		--_label-fs: 13px;
		--_helper-fs: 11px;
		--_gap: 5px;
	}
	.FormField[data-size='md'] {
		--_label-fs: 14px;
		--_helper-fs: 12px;
		--_gap: 6px;
	}
	.FormField[data-size='lg'] {
		--_label-fs: 16px;
		--_helper-fs: 13px;
		--_gap: 7px;
	}

	/* Disabled — dim the scaffold (overrides intent); the control dims itself. */
	.FormField[data-disabled] .label,
	.FormField[data-disabled] .right-text,
	.FormField[data-disabled] .helper {
		color: var(--base-300);
	}
</style>
