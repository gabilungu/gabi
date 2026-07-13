<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../Icon/Icon.svelte';
	import chevronRaw from '../../internal/icons/chevron.svg?raw';

	interface Props {
		text: string;
		href?: string;
		active?: boolean;
		/** Leading icon — a path to an SVG in /static, or raw SVG markup (a `?raw` import), like Icon. */
		icon?: string;
		size?: 'xs' | 'sm' | 'md';
		/** Trailing content after the text (before the chevron on a folder) — a badge, count, etc. */
		right?: Snippet;
		expanded?: boolean;
		children?: Snippet;
		class?: string;
		onclick?: () => void;
	}

	let {
		text,
		href,
		active = false,
		icon,
		size = 'md',
		right,
		expanded = $bindable(false),
		children,
		class: className = '',
		onclick,
	}: Props = $props();

	const isFolder = $derived(!!children);
	const iconSize = $derived(({ xs: 14, sm: 16, md: 16 })[size]);

	function toggle() {
		expanded = !expanded;
	}
</script>

{#snippet inner()}
	{#if icon}<Icon {icon} dimension={iconSize} />{/if}
	<span class="NavTree-item-text">{text}</span>
	{#if right}<span class="NavTree-right">{@render right()}</span>{/if}
{/snippet}

{#if isFolder}
	<div class="NavTree-item-wrapper {className}">
		<!-- The row is a flex container of two independent controls: the main
		     button (label/action) and the chevron button (expand toggle), so
		     the chevron presses and hovers on its own without triggering the row. -->
		<div class="NavTree-item NavTree-row" class:active data-size={size}>
			<button class="NavTree-main" onclick={onclick ?? toggle}>
				{@render inner()}
			</button>
			<button
				class="NavTree-chevron"
				class:expanded
				aria-label={expanded ? 'Collapse' : 'Expand'}
				aria-expanded={expanded}
				onclick={toggle}
			>
				<span class="NavTree-chevron-icon"><Icon icon={chevronRaw} dimension={iconSize} /></span>
			</button>
		</div>
		{#if expanded}
			<div class="NavTree-children">
				{@render children?.()}
			</div>
		{/if}
	</div>
{:else if href}
	<a {href} class="NavTree-item {className}" class:active data-size={size} {onclick}>
		{@render inner()}
	</a>
{:else}
	<button class="NavTree-item {className}" class:active data-size={size} {onclick}>
		{@render inner()}
	</button>
{/if}

<style>
	.NavTree-item {
		display: flex;
		align-items: center;
		width: 100%;
		border: none;
		font-family: inherit;
		color: inherit;
		background: none;
		text-decoration: none;
		cursor: pointer;
		text-align: left;
		box-sizing: border-box;
	}

	/* Right padding matches the chevron button's inset from its centred position
	   (a 24px chevron in a 32px md row leaves 4px), so the toggle sits balanced. */
	.NavTree-item[data-size='xs'] {
		height: 24px;
		padding: 0 4px 0 9px;
		font-size: 11px;
		gap: 5px;
		border-radius: 4px;
	}
	.NavTree-item[data-size='sm'] {
		height: 28px;
		padding: 0 4px 0 10px;
		font-size: 13px;
		gap: 6px;
		border-radius: 5px;
	}
	.NavTree-item[data-size='md'] {
		height: 32px;
		padding: 0 4px 0 12px;
		font-size: 14px;
		gap: 7px;
		border-radius: 6px;
	}

	/* The row itself isn't clickable (a folder splits into two buttons); it
	   still hovers/selects as a whole so it reads as one item. */
	.NavTree-item:hover,
	.NavTree-row:has(.NavTree-main:hover) {
		background: hsl(48, 20%, 95%);
	}

	.NavTree-item.active {
		background: var(--focus-300);
		font-weight: 500;
	}
	.NavTree-item.active:hover,
	.NavTree-row.active:has(.NavTree-main:hover) {
		background: var(--focus-400);
	}

	/* The main control: label + icon, fills the row. */
	.NavTree-main {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: inherit;
		height: 100%;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.NavTree-item-text {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.NavTree-right {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* The chevron: a separate toggle button with its own hover/press. */
	.NavTree-chevron {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		border: none;
		border-radius: 4px;
		background: none;
		color: var(--fg-ll);
		cursor: pointer;
		transition: background-color 0.1s ease;
	}
	.NavTree-chevron:hover {
		background: rgb(0 0 0 / 0.08);
		color: var(--fg-l);
	}
	.NavTree-chevron:active {
		background: rgb(0 0 0 / 0.13);
	}
	/* The internal chevron points down; rotate the icon — not the button, so
	   its hover square stays put — right when collapsed, down when expanded. */
	.NavTree-chevron-icon {
		display: inline-flex;
		transform: rotate(-90deg);
		transition: transform 0.15s ease;
	}
	.NavTree-chevron.expanded .NavTree-chevron-icon {
		transform: rotate(0deg);
	}

	.NavTree-item-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.NavTree-children {
		padding-left: 16px;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
</style>
