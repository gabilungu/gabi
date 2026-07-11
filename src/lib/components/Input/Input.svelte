<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// The native `size` attribute (a character count) is replaced by the scale.
	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
		intent?: 'default' | 'success' | 'warning' | 'danger';
		placeholder?: string;
		disabled?: boolean;
	}

	let {
		value = $bindable(''),
		size = 'md',
		type = 'text',
		intent = 'default',
		placeholder,
		disabled = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<!-- Two-way binding can't use a dynamic `type`, so update `value` by hand. -->
<input
	aria-invalid={intent === 'danger' ? 'true' : undefined}
	{...rest}
	class={className}
	{type}
	{value}
	{placeholder}
	{disabled}
	data-size={size}
	data-intent={intent}
	oninput={(e) => {
		value = e.currentTarget.value;
		rest.oninput?.(e);
	}}
/>

<style>
	input {
		box-sizing: border-box;
		border: 1px solid var(--base-200);
		background: var(--base-0);
		color: var(--base-700);
		font-family: inherit;
		line-height: 1;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	input::placeholder {
		color: var(--base-350);
	}
	input:hover:not(:focus):not(:disabled) {
		box-shadow: 0 0 0 3px var(--action-50);
	}
	input:focus {
		border-color: var(--focus-500);
		box-shadow: 0 0 0 3px var(--focus-200);
	}

	/* Success and warning are presentational hints with no ARIA equivalent, so
	   they key off the intent prop. After :focus so the border wins the tie,
	   and the focused rule out-specifies the plain focus ring. */
	input[data-intent='success'] {
		border-color: var(--success-500);
	}
	input[data-intent='success']:focus {
		box-shadow: 0 0 0 3px var(--success-200);
	}
	input[data-intent='warning'] {
		border-color: var(--warning-500);
	}
	input[data-intent='warning']:focus {
		box-shadow: 0 0 0 3px var(--warning-200);
	}

	/* Invalid is bound to the ARIA state itself, so it lights up both for
	   intent="danger" and for any form validation that sets aria-invalid. */
	input[aria-invalid='true'] {
		border-color: var(--danger-500);
	}
	input[aria-invalid='true']:focus {
		box-shadow: 0 0 0 3px var(--danger-200);
	}

	/* Disabled wins over the validation intents — a disabled field should read inert, not alarming. */
	input:disabled {
		background: var(--base-50);
		color: var(--base-300);
		border-color: var(--base-150);
		cursor: not-allowed;
	}
	input:disabled::placeholder {
		color: var(--base-300);
	}

	input[data-size='xs'] {
		height: 24px;
		padding: 0 6px;
		font-size: 11px;
		border-radius: 4px;
	}
	input[data-size='sm'] {
		height: 28px;
		padding: 0 7px;
		font-size: 13px;
		border-radius: 5px;
	}
	input[data-size='md'] {
		height: 32px;
		padding: 0 8px;
		font-size: 14px;
		border-radius: 6px;
	}
	input[data-size='lg'] {
		height: 40px;
		padding: 0 10px;
		font-size: 15px;
		border-radius: 7px;
	}
</style>
