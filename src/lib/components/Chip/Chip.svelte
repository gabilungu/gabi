<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../Icon/Icon.svelte';
	import closeRaw from '../../internal/icons/close.svg?raw';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		label: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		intent?: 'action' | 'neutral' | 'danger' | 'warning' | 'success';
		/** Emphasis. Only `outlined` draws a border. */
		variant?: 'primary' | 'secondary' | 'outlined';
		/** Selected state for a standalone (filter) chip — bind it to toggle. */
		selected?: boolean;
		/** This chip's value within a choice group (used with `group`). */
		value?: string;
		/** The selected value of a choice group — bind it across chips to pick one. */
		group?: string;
		/** Show a remove (×) button. Ignored on selectable chips. */
		removable?: boolean;
		disabled?: boolean;
		onremove?: (event: MouseEvent) => void;
		/** Fires when a selectable chip's selection changes. */
		onselect?: (selected: boolean) => void;
	}

	let {
		label,
		size = 'md',
		intent = 'neutral',
		variant = 'secondary',
		selected = $bindable(),
		value,
		group = $bindable(),
		removable = false,
		disabled = false,
		onremove,
		onselect,
		onclick,
		class: className,
		...rest
	}: Props = $props();

	// A chip is interactive when it takes part in selection: a bound `group`
	// (single-select choice) or a bound `selected` (multi-select filter).
	const choice = $derived(group !== undefined);
	const selectable = $derived(choice || selected !== undefined);
	const isSelected = $derived(choice ? group === value : !!selected);

	const iconSize = $derived(({ xs: 10, sm: 11, md: 12, lg: 13 })[size]);

	function handleClick(event: MouseEvent) {
		if (selectable && !disabled) {
			if (choice) {
				const was = group === value;
				group = value;
				if (!was) onselect?.(true);
			} else {
				selected = !selected;
				onselect?.(selected);
			}
		}
		onclick?.(event);
	}
</script>

<svelte:element
	this={selectable ? 'button' : 'span'}
	{...rest}
	class={`Chip ${className ?? ''}`}
	data-size={size}
	data-intent={intent}
	data-variant={variant}
	data-selectable={selectable || undefined}
	data-selected={isSelected || undefined}
	data-disabled={disabled || undefined}
	type={selectable ? 'button' : undefined}
	disabled={selectable ? disabled : undefined}
	aria-pressed={selectable ? isSelected : undefined}
	onclick={handleClick}
>
	<span class="label">{label}</span>
	{#if removable && !selectable}
		<button
			type="button"
			class="remove"
			aria-label={`Remove ${label}`}
			{disabled}
			onclick={onremove}
		>
			<Icon icon={closeRaw} dimension={iconSize} weight={2.5} />
		</button>
	{/if}
</svelte:element>

<style>
	.Chip {
		display: inline-flex;
		align-items: center;
		box-sizing: border-box;
		gap: 4px;
		/* Transparent by default; only `outlined` colours it. */
		border: 1px solid transparent;
		border-radius: 999px;
		font-family: inherit;
		line-height: 1;
		white-space: nowrap;
		vertical-align: middle;
	}

	/* Intent → shared --c-* ramp. */
	.Chip[data-intent='action'] {
		--c-100: var(--action-100);
		--c-500: var(--action-500);
		--c-700: var(--action-700);
	}
	.Chip[data-intent='danger'] {
		--c-100: var(--danger-100);
		--c-500: var(--danger-500);
		--c-700: var(--danger-700);
	}
	.Chip[data-intent='warning'] {
		--c-100: var(--warning-100);
		--c-500: var(--warning-500);
		--c-700: var(--warning-700);
	}
	.Chip[data-intent='success'] {
		--c-100: var(--success-100);
		--c-500: var(--success-500);
		--c-700: var(--success-700);
	}
	.Chip[data-intent='neutral'] {
		--c-100: var(--base-200);
		--c-500: var(--base-800);
		--c-700: var(--base-900);
	}

	/* Variants — only `outlined` sets a border-color. */
	.Chip[data-variant='primary'] {
		background: var(--c-500);
		color: var(--base-0);
	}
	.Chip[data-variant='secondary'] {
		background: var(--c-100);
		color: var(--c-700);
	}
	.Chip[data-variant='outlined'] {
		background: transparent;
		color: var(--c-700);
		border-color: var(--c-500);
	}

	/* Selectable chips are buttons; selected ones take the solid look. */
	.Chip[data-selectable] {
		cursor: pointer;
		text-align: center;
	}
	.Chip[data-selectable]:hover:not(:disabled) {
		filter: brightness(0.96);
	}
	.Chip[data-selectable]:focus-visible {
		outline: 2px solid var(--focus-600);
		outline-offset: 2px;
	}
	/* Selected reads the same yellow as the Select's chosen option, whatever the
	   intent. */
	.Chip[data-selected] {
		background: var(--focus-300);
		color: var(--base-900);
		border-color: transparent;
	}

	.Chip[data-disabled] {
		opacity: 0.5;
	}
	.Chip[data-selectable][data-disabled] {
		cursor: not-allowed;
	}

	.label {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* The remove button inherits the chip's text colour. */
	.remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		margin-inline-end: -2px;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		cursor: pointer;
		opacity: 0.65;
		transition: opacity 120ms ease;
	}
	.remove:hover:not(:disabled) {
		opacity: 1;
	}
	.remove:disabled {
		cursor: not-allowed;
	}

	.Chip[data-size='xs'] {
		height: 18px;
		padding: 0 6px;
		font-size: 11px;
		gap: 2px;
	}
	.Chip[data-size='sm'] {
		height: 20px;
		padding: 0 8px;
		font-size: 12px;
		gap: 3px;
	}
	.Chip[data-size='md'] {
		height: 24px;
		padding: 0 10px;
		font-size: 13px;
	}
	.Chip[data-size='lg'] {
		height: 28px;
		padding: 0 12px;
		font-size: 14px;
	}
</style>
