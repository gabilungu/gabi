<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		placeholder?: string;
		disabled?: boolean;
		rows?: number;
	}

	let {
		value = $bindable(''),
		size = 'md',
		placeholder,
		disabled = false,
		rows = 3,
		class: className,
		...rest
	}: Props = $props();
</script>

<textarea {...rest} class={className} {placeholder} {disabled} {rows} data-size={size} bind:value></textarea>

<style>
	textarea {
		box-sizing: border-box;
		width: 100%;
		border: 1px solid #d1d5db;
		background: #fff;
		color: #111827;
		font-family: inherit;
		line-height: 1.5;
		resize: vertical;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	textarea::placeholder {
		color: #9ca3af;
	}
	textarea:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
	}
	textarea:disabled {
		background: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}

	/* Multi-line: no fixed height, symmetric padding (mitek Textarea scale). */
	textarea[data-size='xs'] {
		padding: 6px;
		font-size: 11px;
		border-radius: 4px;
	}
	textarea[data-size='sm'] {
		padding: 7px;
		font-size: 13px;
		border-radius: 5px;
	}
	textarea[data-size='md'] {
		padding: 8px;
		font-size: 14px;
		border-radius: 6px;
	}
	textarea[data-size='lg'] {
		padding: 10px;
		font-size: 15px;
		border-radius: 7px;
	}
</style>
