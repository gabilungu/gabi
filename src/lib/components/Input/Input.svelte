<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// The native `size` attribute (a character count) is replaced by the scale.
	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		value?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
		placeholder?: string;
		disabled?: boolean;
	}

	let {
		value = $bindable(''),
		size = 'md',
		type = 'text',
		placeholder,
		disabled = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<!-- Two-way binding can't use a dynamic `type`, so update `value` by hand. -->
<input
	{...rest}
	class={className}
	{type}
	{value}
	{placeholder}
	{disabled}
	data-size={size}
	oninput={(e) => {
		value = e.currentTarget.value;
		rest.oninput?.(e);
	}}
/>

<style>
	input {
		box-sizing: border-box;
		border: 1px solid #d1d5db;
		background: #fff;
		color: #111827;
		font-family: inherit;
		line-height: 1;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	input::placeholder {
		color: #9ca3af;
	}
	input:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
	}
	input:disabled {
		background: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
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
