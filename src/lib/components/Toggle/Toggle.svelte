<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// The native `size` attribute is replaced by the scale.
	interface Props extends Omit<HTMLInputAttributes, 'size' | 'checked'> {
		/** Whether the switch is on. */
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
	class={`Toggle ${className ?? ''}`}
	data-size={size}
	data-disabled={disabled || undefined}
>
	<input {...rest} type="checkbox" role="switch" {disabled} bind:checked />
	{#if label}<span class="label">{label}</span>{/if}
</label>

<style>
	.Toggle {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: inherit;
		color: var(--base-700);
		cursor: pointer;
		user-select: none;
	}
	.Toggle[data-disabled] {
		color: var(--base-400);
		cursor: not-allowed;
	}

	/* The track. */
	input {
		appearance: none;
		-webkit-appearance: none;
		box-sizing: border-box;
		position: relative;
		margin: 0;
		flex-shrink: 0;
		width: var(--_w);
		height: var(--_h);
		border-radius: 999px;
		background: var(--base-200);
		cursor: inherit;
		box-shadow: 0 0 0 0 transparent;
		transition:
			background-color 150ms ease,
			box-shadow 150ms ease;
	}
	/* The knob — slides from left (off) to right (on). */
	input::before {
		content: '';
		position: absolute;
		top: 50%;
		left: var(--_inset);
		width: var(--_knob);
		height: var(--_knob);
		border-radius: 50%;
		background: var(--base-700);
		transform: translateY(-50%);
		transition: transform 150ms ease;
	}

	input:hover:not(:focus-visible):not(:disabled) {
		box-shadow: 0 0 0 3px var(--action-50);
	}
	input:checked {
		background: var(--focus-400);
	}
	input:checked::before {
		transform: translateY(-50%) translateX(var(--_travel));
	}
	input:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px var(--action-200);
	}
	input:disabled {
		background: var(--base-200);
	}
	input:disabled::before {
		background: var(--base-400);
	}
	input:checked:disabled {
		background: var(--base-300);
	}

	/* Sizes: track width/height, knob diameter, edge inset, and on-travel. */
	.Toggle[data-size='sm'] {
		font-size: 13px;
	}
	.Toggle[data-size='sm'] input {
		--_w: 28px;
		--_h: 16px;
		--_knob: 10px;
		--_inset: 3px;
		--_travel: 12px;
	}
	.Toggle[data-size='md'] {
		font-size: 14px;
	}
	.Toggle[data-size='md'] input {
		--_w: 36px;
		--_h: 20px;
		--_knob: 14px;
		--_inset: 3px;
		--_travel: 16px;
	}
	.Toggle[data-size='lg'] {
		font-size: 15px;
	}
	.Toggle[data-size='lg'] input {
		--_w: 44px;
		--_h: 24px;
		--_knob: 18px;
		--_inset: 3px;
		--_travel: 20px;
	}
</style>
