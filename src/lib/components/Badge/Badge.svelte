<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Text or count. Omit for a `dot` badge. */
		label?: string | number;
		size?: 'sm' | 'md';
		intent?: 'action' | 'neutral' | 'danger' | 'warning' | 'success';
		variant?: 'solid' | 'soft';
		/** Render as a small status dot with no label. */
		dot?: boolean;
	}

	let {
		label,
		size = 'md',
		intent = 'neutral',
		variant = 'solid',
		dot = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<span
	{...rest}
	class={`Badge ${className ?? ''}`}
	data-size={size}
	data-intent={intent}
	data-variant={variant}
	data-dot={dot || undefined}
>
	{#if !dot}{label}{/if}
</span>

<style>
	.Badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border-radius: 999px;
		font-family: inherit;
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
		vertical-align: middle;
	}

	/* Intent → shared --c-* ramp. */
	.Badge[data-intent='action'] {
		--c-100: var(--action-100);
		--c-500: var(--action-500);
		--c-700: var(--action-700);
	}
	.Badge[data-intent='danger'] {
		--c-100: var(--danger-100);
		--c-500: var(--danger-500);
		--c-700: var(--danger-700);
	}
	.Badge[data-intent='warning'] {
		--c-100: var(--warning-100);
		--c-500: var(--warning-500);
		--c-700: var(--warning-700);
	}
	.Badge[data-intent='success'] {
		--c-100: var(--success-100);
		--c-500: var(--success-500);
		--c-700: var(--success-700);
	}
	.Badge[data-intent='neutral'] {
		--c-100: var(--base-200);
		--c-500: var(--base-800);
		--c-700: var(--base-900);
	}

	.Badge[data-variant='solid'] {
		background: var(--c-500);
		color: var(--base-0);
	}
	.Badge[data-variant='soft'] {
		background: var(--c-100);
		color: var(--c-700);
	}

	/* min-width = height keeps a single-character count circular. */
	.Badge[data-size='sm'] {
		height: 16px;
		min-width: 16px;
		padding: 0 5px;
		font-size: 10px;
	}
	.Badge[data-size='md'] {
		height: 20px;
		min-width: 20px;
		padding: 0 6px;
		font-size: 12px;
	}

	/* Dot — a small circle, no label. */
	.Badge[data-dot] {
		padding: 0;
	}
	.Badge[data-dot][data-size='sm'] {
		width: 8px;
		height: 8px;
		min-width: 0;
	}
	.Badge[data-dot][data-size='md'] {
		width: 10px;
		height: 10px;
		min-width: 0;
	}
</style>
