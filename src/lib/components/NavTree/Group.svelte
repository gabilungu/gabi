<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../Icon/Icon.svelte';
	import chevronRaw from '../../internal/icons/chevron.svg?raw';

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
			<Icon icon={chevronRaw} dimension={14} />
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
		margin: 12px 0;
	}

	.NavTree-group-label {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0 12px;
		border: none;
		background: none;
		font-family: inherit;
		font-size: 11px;
		font-weight: 600;
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

	/* Inherits the label colour; the internal chevron points down, so rotate it
	   to point right when collapsed, back to down when expanded. */
	.NavTree-chevron {
		display: inline-flex;
		align-items: center;
		margin-left: auto;
		transform: rotate(-90deg);
		transition: transform 0.15s ease;
	}

	.NavTree-chevron.expanded {
		transform: rotate(0deg);
	}

	.NavTree-group-children {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
</style>
