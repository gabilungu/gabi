<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { TABS_KEY, type TabsContext } from './context.js';

	/**
	 * @cssvar {color} --accent - Active tab colour + underline (default: `var(--action-600)`)
	 * @cssvar {shorthand} --border - Track divider under the tabs (default: `1px solid var(--base-150)`)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The active tab's value. Bindable. */
		value?: string;
		/** Size preset — shares Button's height scale. Default: 'md'. */
		size?: 'xs' | 'sm' | 'md' | 'lg';
		children: Snippet;
	}

	let { value = $bindable(''), size = 'md', class: className = '', children, ...rest }: Props = $props();

	const ctx: TabsContext = {
		get value() {
			return value;
		},
		get size() {
			return size;
		},
		select(v) {
			value = v;
		},
		registerTab(v) {
			if (value === '') value = v;
		},
	};
	setContext(TABS_KEY, ctx);
</script>

<div {...rest} class="Tabs {className}" data-size={size}>
	{@render children()}
</div>

<style>
	.Tabs {
		display: flex;
		flex-direction: column;
		min-width: 0;
		color: var(--fg);
	}

	/* Tab list ------------------------------------------------------------- */
	.Tabs :global(.Tabs-list) {
		display: flex;
		align-items: stretch;
		gap: 2px;
		border-bottom: var(--border, 1px solid var(--base-150));
	}

	/* Tab ------------------------------------------------------------------ */
	.Tabs :global(.Tabs-tab) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		background: none;
		font-family: inherit;
		font-weight: 500;
		color: var(--fg-l);
		white-space: nowrap;
		cursor: pointer;
		transition:
			color 0.12s ease,
			border-color 0.12s ease,
			background 0.12s ease;
	}
	.Tabs :global(.Tabs-tab:hover:not(:disabled)) {
		color: var(--fg);
	}
	.Tabs :global(.Tabs-tab[aria-selected='true']) {
		color: var(--accent, var(--action-600));
		border-bottom-color: var(--accent, var(--action-600));
	}
	.Tabs :global(.Tabs-tab:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.Tabs :global(.Tabs-tab:focus-visible) {
		outline: 2px solid var(--focus-500, var(--action-600));
		outline-offset: -2px;
		border-radius: 4px;
	}

	/* Size presets — heights match Button (xs 24 / sm 28 / md 32 / lg 40) --- */
	.Tabs[data-size='xs'] :global(.Tabs-tab) {
		height: 24px;
		padding: 0 8px;
		font-size: 11px;
		gap: 5px;
	}
	.Tabs[data-size='sm'] :global(.Tabs-tab) {
		height: 28px;
		padding: 0 10px;
		font-size: 13px;
		gap: 6px;
	}
	.Tabs[data-size='md'] :global(.Tabs-tab) {
		height: 32px;
		padding: 0 12px;
		font-size: 14px;
		gap: 7px;
	}
	.Tabs[data-size='lg'] :global(.Tabs-tab) {
		height: 40px;
		padding: 0 16px;
		font-size: 16px;
		gap: 8px;
	}

	/* Panel ---------------------------------------------------------------- */
	.Tabs :global(.Tabs-panel) {
		padding-top: 16px;
		min-width: 0;
	}
	.Tabs :global(.Tabs-panel:focus-visible) {
		outline: none;
	}
</style>
