<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		expanded?: boolean;
		children?: Snippet;
		class?: string;
		onclick?: () => void;
	}

	let { label, expanded = $bindable(true), children, class: className = '', onclick }: Props = $props();

	function toggle() {
		expanded = !expanded;
	}
</script>

<div class="NavTree-group {className}">
	<button class="NavTree-group-label" onclick={onclick ?? toggle}>
		<span class="NavTree-group-text">{label}</span>
		<span class="NavTree-chevron" class:expanded>
			<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
		</span>
	</button>
	{#if expanded && children}
		<div class="NavTree-group-children">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.NavTree-group {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: var(--p, 0);
		margin: var(--m, 12px 0);
		border-radius: var(--r, 0);
		border: var(--b, none);
	}

	.NavTree-group-label {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0 12px;
		border: none;
		background: none;
		font: inherit;
		font-size: 11px;
		font-weight: var(--font-weight, 600);
		color: var(--fg-ll);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		cursor: pointer;
		text-align: left;
	}

	.NavTree-group-label:hover {
		color: var(--fg-l);
	}

	.NavTree-group-text {
		flex: 1;
	}

	.NavTree-chevron {
		display: inline-flex;
		align-items: center;
		margin-left: auto;
	}

	.NavTree-chevron svg {
		transition: transform 0.15s ease;
	}

	.NavTree-chevron.expanded svg {
		transform: rotate(90deg);
	}

	.NavTree-group-children {
		padding-left: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
</style>
