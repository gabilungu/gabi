<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		label: string;
		type?: 'button' | 'submit' | 'reset';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		intent?: 'action' | 'neutral' | 'danger' | 'warning' | 'success';
		/** Emphasis. Only `outlined` draws a border. */
		variant?: 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'ghost' | 'link';
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		label,
		type = 'button',
		size = 'md',
		intent = 'action',
		variant = 'primary',
		disabled = false,
		onclick,
		class: className,
		...rest
	}: Props = $props();
</script>

<button
	{...rest}
	class={className}
	{type}
	{disabled}
	{onclick}
	data-size={size}
	data-intent={intent}
	data-variant={variant}
>{label}</button>

<style>
	button {
		box-sizing: border-box;
		/* Transparent by default; only `outlined` colours it. */
		border: 1px solid transparent;
		cursor: pointer;
		font-family: inherit;
		text-decoration: none;
		transition:
			background-color 120ms ease,
			border-color 120ms ease,
			color 120ms ease;
	}

	/* Each intent maps the palette into a shared --c-* ramp; the variant rules
	   below are written once and read from it. */
	button[data-intent='action'] {
		--c-50: var(--action-50);
		--c-100: var(--action-100);
		--c-200: var(--action-200);
		--c-500: var(--action-500);
		--c-600: var(--action-600);
		--c-700: var(--action-700);
	}
	button[data-intent='danger'] {
		--c-50: var(--danger-50);
		--c-100: var(--danger-100);
		--c-200: var(--danger-200);
		--c-500: var(--danger-500);
		--c-600: var(--danger-600);
		--c-700: var(--danger-700);
	}
	button[data-intent='warning'] {
		--c-50: var(--warning-50);
		--c-100: var(--warning-100);
		--c-200: var(--warning-200);
		--c-500: var(--warning-500);
		--c-600: var(--warning-600);
		--c-700: var(--warning-700);
	}
	button[data-intent='success'] {
		--c-50: var(--success-50);
		--c-100: var(--success-100);
		--c-200: var(--success-200);
		--c-500: var(--success-500);
		--c-600: var(--success-600);
		--c-700: var(--success-700);
	}
	button[data-intent='neutral'] {
		--c-50: var(--base-100);
		--c-100: var(--base-200);
		--c-200: var(--base-300);
		--c-500: var(--base-800);
		--c-600: var(--base-850);
		--c-700: var(--base-900);
	}

	/* Variants — emphasis. Only `outlined` sets a border-color. */
	button[data-variant='primary'] {
		background: var(--c-500);
		color: var(--base-0);
	}
	button[data-variant='primary']:hover:not(:disabled) {
		background: var(--c-600);
	}
	button[data-variant='primary']:active:not(:disabled) {
		background: var(--c-700);
	}

	button[data-variant='secondary'] {
		background: var(--c-100);
		color: var(--c-700);
	}
	button[data-variant='secondary']:hover:not(:disabled) {
		background: var(--c-200);
	}

	button[data-variant='tertiary'] {
		background: var(--base-0);
		color: var(--c-700);
	}
	button[data-variant='tertiary']:hover:not(:disabled) {
		background: var(--base-200);
	}

	button[data-variant='outlined'] {
		background: transparent;
		color: var(--c-700);
		border-color: var(--c-500);
	}
	button[data-variant='outlined']:hover:not(:disabled) {
		background: var(--c-50);
	}

	button[data-variant='ghost'] {
		background: transparent;
		color: var(--c-700);
	}
	button[data-variant='ghost']:hover:not(:disabled) {
		background: var(--c-100);
	}

	button[data-variant='link'] {
		background: transparent;
		color: var(--c-600);
		text-decoration: underline;
	}
	button[data-variant='link']:hover:not(:disabled) {
		color: var(--c-700);
	}

	button:focus-visible {
		outline: 2px solid var(--focus-600);
		outline-offset: 2px;
	}

	/* Disabled — muted and inert; specific enough to override the variant rules. */
	button[data-variant]:disabled {
		color: var(--base-400);
		border-color: transparent;
		cursor: not-allowed;
	}
	button[data-variant='primary']:disabled {
		background: var(--base-200);
	}
	button[data-variant='secondary']:disabled,
	button[data-variant='tertiary']:disabled {
		background: var(--base-100);
	}
	button[data-variant='outlined']:disabled {
		background: transparent;
		border-color: var(--base-200);
	}
	button[data-variant='ghost']:disabled,
	button[data-variant='link']:disabled {
		background: transparent;
	}

	button[data-size='xs'] {
		height: 24px;
		padding: 0 9px;
		font-size: 11px;
		border-radius: 4px;
	}
	button[data-size='sm'] {
		height: 28px;
		padding: 0 10px;
		font-size: 13px;
		border-radius: 5px;
	}
	button[data-size='md'] {
		height: 32px;
		padding: 0 12px;
		font-size: 14px;
		border-radius: 6px;
	}
	button[data-size='lg'] {
		height: 40px;
		padding: 0 15px;
		font-size: 16px;
		border-radius: 7px;
	}
</style>
