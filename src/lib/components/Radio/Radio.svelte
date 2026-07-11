<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// The native `size` attribute is replaced by the scale.
	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value'> {
		/** The value this radio contributes to its group. */
		value: string;
		/** The group's selected value — bind it across the radios that share it. */
		group?: string;
		/** Control size. Default: 'md'. */
		size?: 'sm' | 'md' | 'lg';
		/** Optional label rendered beside the control. */
		label?: string;
		disabled?: boolean;
	}

	let {
		value,
		group = $bindable(),
		size = 'md',
		label,
		disabled = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<label
	class={`Radio ${className ?? ''}`}
	data-size={size}
	data-disabled={disabled || undefined}
>
	<input {...rest} type="radio" {value} {disabled} bind:group />
	{#if label}<span class="label">{label}</span>{/if}
</label>

<style>
	.Radio {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: inherit;
		color: var(--base-700);
		cursor: pointer;
		user-select: none;
	}
	.Radio[data-disabled] {
		color: var(--base-400);
		cursor: not-allowed;
	}

	input {
		appearance: none;
		-webkit-appearance: none;
		box-sizing: border-box;
		margin: 0;
		flex-shrink: 0;
		/* Unselected: a 2px inset ring in the input's border colour. */
		border: 2px solid var(--base-200);
		border-radius: 50%;
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
	/* Selected: no border, a focus-500 fill with a base-900 centre dot. The
	   background paints under the now-transparent border (border-box clip), so
	   the fill reaches the edge; the radial-gradient lays the dot over it. */
	input:checked {
		border-color: transparent;
		background:
			radial-gradient(
				circle at center,
				var(--base-900) 0 var(--_dot-r),
				transparent var(--_dot-r)
			),
			var(--focus-400);
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
		background:
			radial-gradient(
				circle at center,
				var(--base-500) 0 var(--_dot-r),
				transparent var(--_dot-r)
			),
			var(--base-300);
	}

	/* Sizes: control diameter + the gap that sizes the centre dot. */
	.Radio[data-size='sm'] {
		font-size: 13px;
	}
	.Radio[data-size='sm'] input {
		width: 16px;
		height: 16px;
		--_dot-r: 3.5px;
	}
	.Radio[data-size='md'] {
		font-size: 14px;
	}
	.Radio[data-size='md'] input {
		width: 20px;
		height: 20px;
		--_dot-r: 4.5px;
	}
	.Radio[data-size='lg'] {
		font-size: 15px;
	}
	.Radio[data-size='lg'] input {
		width: 24px;
		height: 24px;
		--_dot-r: 5.5px;
	}
</style>
