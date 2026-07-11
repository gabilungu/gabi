<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// The native `size` attribute is replaced by the scale.
	interface Props extends Omit<HTMLInputAttributes, 'size' | 'checked'> {
		/** Whether the box is checked. */
		checked?: boolean;
		/** Control size. Default: 'md'. */
		size?: 'sm' | 'md' | 'lg';
		/** Optional label rendered beside the control. */
		label?: string;
		disabled?: boolean;
	}

	let {
		checked = $bindable(false),
		size = 'md',
		label,
		disabled = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<label
	class={`Checkbox ${className ?? ''}`}
	data-size={size}
	data-disabled={disabled || undefined}
>
	<input {...rest} type="checkbox" {disabled} bind:checked />
	{#if label}<span class="label">{label}</span>{/if}
</label>

<style>
	.Checkbox {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: inherit;
		color: var(--base-700);
		cursor: pointer;
		user-select: none;
	}
	.Checkbox[data-disabled] {
		color: var(--base-400);
		cursor: not-allowed;
	}

	input {
		appearance: none;
		-webkit-appearance: none;
		box-sizing: border-box;
		position: relative;
		margin: 0;
		flex-shrink: 0;
		/* Unchecked: a 2px inset ring in the input's border colour. Square, not round. */
		border: 2px solid var(--base-200);
		border-radius: var(--_radius);
		background: var(--base-0);
		cursor: inherit;
		box-shadow: 0 0 0 0 transparent;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}

	input:hover:not(:checked):not(:disabled) {
		border-color: var(--action-300);
	}
	/* Checked: no border, a focus-400 fill; the mark is a centred base-900
	   square (::before, so it can carry a corner radius). */
	input:checked {
		border-color: transparent;
		background: var(--focus-400);
	}
	input:checked::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: var(--_mark);
		height: var(--_mark);
		border-radius: var(--_mark-radius);
		background: var(--base-900);
		transform: translate(-50%, -50%);
	}
	input:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px var(--action-200);
	}
	input:disabled {
		border-color: var(--base-200);
		background: var(--base-100);
	}
	input:checked:disabled {
		border-color: transparent;
		background: var(--base-300);
	}
	input:checked:disabled::before {
		background: var(--base-500);
	}

	/* Sizes: box diameter, corner radius, and the dot size. */
	.Checkbox[data-size='sm'] {
		font-size: 13px;
	}
	.Checkbox[data-size='sm'] input {
		width: 16px;
		height: 16px;
		--_radius: 4px;
		--_mark: 7px;
		--_mark-radius: 2px;
	}
	.Checkbox[data-size='md'] {
		font-size: 14px;
	}
	.Checkbox[data-size='md'] input {
		width: 20px;
		height: 20px;
		--_radius: 5px;
		--_mark: 9px;
		--_mark-radius: 2px;
	}
	.Checkbox[data-size='lg'] {
		font-size: 15px;
	}
	.Checkbox[data-size='lg'] input {
		width: 24px;
		height: 24px;
		--_radius: 6px;
		--_mark: 11px;
		--_mark-radius: 3px;
	}
</style>
