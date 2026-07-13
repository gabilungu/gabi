<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../Icon/Icon.svelte';

	interface Option {
		/** The value reported when this segment is chosen. */
		value: string;
		/** Visible text (optional if icon-only). */
		label?: string;
		/** Leading icon — a path to an SVG or raw SVG markup. */
		icon?: string;
		disabled?: boolean;
	}

	/**
	 * @cssvar {shorthand} --bg - Track background (default: `var(--base-100)`)
	 * @cssvar {shorthand} --thumbBg - Selected segment background (default: `var(--base-0)`)
	 * @cssvar {color} --activeFg - Selected segment text (default: `var(--fg)`)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The segments. */
		options: Option[];
		/** The chosen value. Bindable. */
		value?: string;
		/** Size preset — total height matches Button's scale. Default: 'md'. */
		size?: 'xs' | 'sm' | 'md' | 'lg';
		/** Width — 'hug' (fit content, the default), 'fill' (100%), a number (px),
		 * or any CSS length. */
		width?: 'fill' | 'hug' | number | string;
	}

	let {
		options,
		value = $bindable(''),
		size = 'md',
		width = 'hug',
		class: className = '',
		...rest
	}: Props = $props();

	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;
	const resolvedWidth = $derived(
		width === 'fill' ? '100%' : width === 'hug' ? 'fit-content' : px(width),
	);
	const iconSize = $derived(({ xs: 12, sm: 14, md: 14, lg: 16 })[size]);

	// For roving tabindex when nothing is selected yet — the first enabled segment
	// takes focus.
	const firstEnabled = $derived(options.find((o) => !o.disabled)?.value);

	let group = $state<HTMLElement>();

	function onkeydown(event: KeyboardEvent) {
		const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
		if (!keys.includes(event.key)) return;
		const enabled = options.filter((o) => !o.disabled);
		if (enabled.length === 0) return;
		const current = enabled.findIndex((o) => o.value === value);
		let next = current < 0 ? 0 : current;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % enabled.length;
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
			next = (current - 1 + enabled.length) % enabled.length;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = enabled.length - 1;
		event.preventDefault();
		value = enabled[next].value;
		group?.querySelector<HTMLElement>(`[data-value="${CSS.escape(enabled[next].value)}"]`)?.focus();
	}
</script>

<div
	{...rest}
	bind:this={group}
	class="Segmented {className}"
	data-size={size}
	role="radiogroup"
	style:width={resolvedWidth}
	{onkeydown}
>
	{#each options as opt (opt.value)}
		{@const checked = value === opt.value}
		<button
			type="button"
			class="Segmented-item"
			class:Segmented-active={checked}
			role="radio"
			aria-checked={checked}
			aria-label={opt.label ?? opt.value}
			data-value={opt.value}
			disabled={opt.disabled}
			tabindex={checked || (value === '' && firstEnabled === opt.value) ? 0 : -1}
			onclick={() => (value = opt.value)}
		>
			{#if opt.icon}<Icon icon={opt.icon} dimension={iconSize} />{/if}
			{#if opt.label}<span class="Segmented-label">{opt.label}</span>{/if}
		</button>
	{/each}
</div>

<style>
	.Segmented {
		display: inline-flex;
		box-sizing: border-box;
		align-items: stretch;
		gap: 2px;
		background: var(--bg, var(--base-100));
		color: var(--fg);
	}

	.Segmented-item {
		flex: 1 1 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border: none;
		background: none;
		font-family: inherit;
		font-weight: 500;
		color: var(--fg-l);
		white-space: nowrap;
		cursor: pointer;
		transition:
			color 0.12s ease,
			background 0.12s ease,
			box-shadow 0.12s ease;
	}
	.Segmented-item:hover:not(:disabled):not(.Segmented-active) {
		color: var(--fg);
	}
	.Segmented-active {
		background: var(--thumbBg, var(--base-0));
		color: var(--activeFg, var(--fg));
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
	}
	.Segmented-item:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.Segmented-item:focus-visible {
		outline: 2px solid var(--focus-500, var(--action-600));
		outline-offset: -2px;
	}
	.Segmented-label {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Size presets — the whole control's height matches Button (xs 24 / sm 28 /
	   md 32 / lg 40); border-box folds the track padding into that height. */
	.Segmented[data-size='xs'] {
		height: 24px;
		padding: 2px;
		border-radius: 6px;
	}
	.Segmented[data-size='xs'] .Segmented-item {
		padding: 0 8px;
		font-size: 11px;
		gap: 4px;
		border-radius: 4px;
	}
	.Segmented[data-size='sm'] {
		height: 28px;
		padding: 3px;
		border-radius: 7px;
	}
	.Segmented[data-size='sm'] .Segmented-item {
		padding: 0 10px;
		font-size: 13px;
		gap: 5px;
		border-radius: 5px;
	}
	.Segmented[data-size='md'] {
		height: 32px;
		padding: 3px;
		border-radius: 8px;
	}
	.Segmented[data-size='md'] .Segmented-item {
		padding: 0 12px;
		font-size: 14px;
		gap: 6px;
		border-radius: 6px;
	}
	.Segmented[data-size='lg'] {
		height: 40px;
		padding: 4px;
		border-radius: 9px;
	}
	.Segmented[data-size='lg'] .Segmented-item {
		padding: 0 16px;
		font-size: 16px;
		gap: 7px;
		border-radius: 7px;
	}
</style>
