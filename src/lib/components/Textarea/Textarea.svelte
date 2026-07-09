<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		intent?: 'default' | 'success' | 'warning' | 'danger';
		placeholder?: string;
		disabled?: boolean;
		rows?: number;
	}

	let {
		value = $bindable(''),
		size = 'md',
		intent = 'default',
		placeholder,
		disabled = false,
		rows = 3,
		class: className,
		...rest
	}: Props = $props();
</script>

<textarea
	aria-invalid={intent === 'danger' ? 'true' : undefined}
	{...rest}
	class={className}
	{placeholder}
	{disabled}
	{rows}
	data-size={size}
	data-intent={intent}
	bind:value
></textarea>

<style>
	textarea {
		box-sizing: border-box;
		width: 100%;
		border: 1px solid var(--bg-ddd);
		background: var(--bg-l);
		color: var(--fg);
		font-family: inherit;
		line-height: 1.5;
		resize: vertical;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	textarea::placeholder {
		color: var(--fg-lll);
	}
	textarea:focus {
		border-color: var(--focus);
		box-shadow: 0 0 0 3px var(--focus-ll);
	}

	/* Success and warning are presentational hints with no ARIA equivalent, so
	   they key off the intent prop. After :focus so the border wins the tie,
	   and the focused rule out-specifies the plain focus ring. */
	textarea[data-intent='success'] {
		border-color: var(--success);
	}
	textarea[data-intent='success']:focus {
		box-shadow: 0 0 0 3px var(--success-llll);
	}
	textarea[data-intent='warning'] {
		border-color: var(--warning);
	}
	textarea[data-intent='warning']:focus {
		box-shadow: 0 0 0 3px var(--warning-llll);
	}

	/* Invalid is bound to the ARIA state itself, so it lights up both for
	   intent="danger" and for any form validation that sets aria-invalid. */
	textarea[aria-invalid='true'] {
		border-color: var(--danger);
	}
	textarea[aria-invalid='true']:focus {
		box-shadow: 0 0 0 3px var(--danger-llll);
	}

	/* Disabled wins over the validation intents — a disabled field should read inert, not alarming. */
	textarea:disabled {
		background: var(--disabled-lll);
		color: var(--disabled-dd);
		border-color: var(--disabled-l);
		cursor: not-allowed;
	}
	textarea:disabled::placeholder {
		color: var(--disabled-dd);
	}

	/* Multi-line: no fixed height, symmetric padding (gabi Textarea scale). */
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
