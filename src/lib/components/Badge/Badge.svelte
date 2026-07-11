<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @cssvar {color} --bg - Background colour (default: var(--base-200))
	 * @cssvar {color} --fg - Text colour (default: var(--base-900))
	 */
	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** Text or count. Omit for a `dot` badge. */
		text?: string | number;
		size?: 'xs' | 'sm' | 'md';
		/** Render as a small status dot with no label. */
		dot?: boolean;
	}

	let {
		text,
		size = 'md',
		dot = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<span
	{...rest}
	class={`Badge ${className ?? ''}`}
	data-size={size}
	data-dot={dot || undefined}
>
	{#if !dot}{text}{/if}
</span>

<style>
	.Badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border-radius: 999px;
		font-family: inherit;
		line-height: 1;
		white-space: nowrap;
		vertical-align: middle;
		/* Colour it by setting --bg / --fg (e.g.
		   style="--bg: var(--danger-500); --fg: var(--base-0)").
		   Solid vs soft is just your choice of the two values. */
		background: var(--bg, var(--base-200));
		color: var(--fg, var(--base-900));
	}

	/* Sizes match Chip; min-width = height keeps a single-character count circular. */
	.Badge[data-size='xs'] {
		height: 18px;
		min-width: 18px;
		padding: 0 6px;
		font-size: 11px;
	}
	.Badge[data-size='sm'] {
		height: 20px;
		min-width: 20px;
		padding: 0 8px;
		font-size: 12px;
	}
	.Badge[data-size='md'] {
		height: 24px;
		min-width: 24px;
		padding: 0 10px;
		font-size: 13px;
	}

	/* Dot — a small circle, no label. */
	.Badge[data-dot] {
		padding: 0;
	}
	.Badge[data-dot][data-size='xs'] {
		width: 7px;
		height: 7px;
		min-width: 0;
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
