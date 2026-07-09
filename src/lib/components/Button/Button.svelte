<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		label: string;
		type?: 'button' | 'submit' | 'reset';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		intent?: 'default' | 'mono' | 'danger' | 'warning' | 'success';
		variant?: 'solid' | 'outline' | 'ghost';
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		label,
		type = 'button',
		size = 'md',
		intent = 'default',
		variant = 'solid',
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
		border: 1px solid transparent;
		cursor: pointer;
		font-family: inherit;
		transition:
			background-color 120ms ease,
			border-color 120ms ease,
			color 120ms ease;
	}

	/* One block per intent. Solid is the block's own rest state; outline and
	   ghost go transparent at rest, and every variant fills in on hover/active
	   (the &:hover / &:active rules match regardless of variant). */
	button[data-intent='default'] {
		background: var(--action);
		color: var(--action-llll);

		&:hover:not(:disabled) {
			background: var(--action-l);
			border-color: var(--action-l);
			color: var(--action-llll);
		}
		&:active:not(:disabled) {
			background: var(--action-ll);
			border-color: var(--action-ll);
			color: var(--action-llll);
		}
		&[data-variant='outline'] {
			background: transparent;
			color: var(--action);
			border-color: var(--action);
		}
		&[data-variant='ghost'] {
			background: transparent;
			color: var(--action);
		}
	}

	button[data-intent='mono'] {
		background: var(--fg);
		color: var(--bg-l);

		&:hover:not(:disabled) {
			background: var(--fg-l);
			border-color: var(--fg-l);
			color: var(--bg-l);
		}
		&:active:not(:disabled) {
			background: var(--fg-ll);
			border-color: var(--fg-ll);
			color: var(--bg-l);
		}
		&[data-variant='outline'] {
			background: transparent;
			color: var(--fg);
			border-color: var(--fg);
		}
		&[data-variant='ghost'] {
			background: transparent;
			color: var(--fg);
		}
	}

	button[data-intent='danger'] {
		background: var(--danger);
		color: var(--danger-llll);

		&:hover:not(:disabled) {
			background: var(--danger-l);
			border-color: var(--danger-l);
			color: var(--danger-llll);
		}
		&:active:not(:disabled) {
			background: var(--danger-ll);
			border-color: var(--danger-ll);
			color: var(--danger-llll);
		}
		&[data-variant='outline'] {
			background: transparent;
			color: var(--danger);
			border-color: var(--danger);
		}
		&[data-variant='ghost'] {
			background: transparent;
			color: var(--danger);
		}
	}

	button[data-intent='warning'] {
		background: var(--warning);
		color: var(--warning-llll);

		&:hover:not(:disabled) {
			background: var(--warning-l);
			border-color: var(--warning-l);
			color: var(--warning-llll);
		}
		&:active:not(:disabled) {
			background: var(--warning-ll);
			border-color: var(--warning-ll);
			color: var(--warning-llll);
		}
		&[data-variant='outline'] {
			background: transparent;
			color: var(--warning);
			border-color: var(--warning);
		}
		&[data-variant='ghost'] {
			background: transparent;
			color: var(--warning);
		}
	}

	button[data-intent='success'] {
		background: var(--success);
		color: var(--success-llll);

		&:hover:not(:disabled) {
			background: var(--success-l);
			border-color: var(--success-l);
			color: var(--success-llll);
		}
		&:active:not(:disabled) {
			background: var(--success-ll);
			border-color: var(--success-ll);
			color: var(--success-llll);
		}
		&[data-variant='outline'] {
			background: transparent;
			color: var(--success);
			border-color: var(--success);
		}
		&[data-variant='ghost'] {
			background: transparent;
			color: var(--success);
		}
	}

	button:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	/* Intent-independent, and specific enough to override the outline/ghost
	   rules above so every disabled button reads the same. */
	button[data-intent]:disabled {
		background: var(--disabled);
		color: var(--disabled-dd);
		border-color: transparent;
		cursor: not-allowed;
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
