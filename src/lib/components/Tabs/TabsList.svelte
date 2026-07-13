<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Labels the tablist for assistive tech. */
		'aria-label'?: string;
		children: Snippet;
	}

	let { 'aria-label': ariaLabel, children }: Props = $props();

	let list = $state<HTMLElement>();

	// Roving arrow-key navigation with automatic activation (focusing a tab
	// selects it), following the WAI-ARIA tabs pattern.
	function onkeydown(event: KeyboardEvent) {
		const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
		if (!keys.includes(event.key) || !list) return;
		const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])')];
		const current = tabs.indexOf(document.activeElement as HTMLElement);
		let next: HTMLElement | undefined;
		if (event.key === 'ArrowRight') next = tabs[(current + 1) % tabs.length];
		else if (event.key === 'ArrowLeft') next = tabs[(current - 1 + tabs.length) % tabs.length];
		else if (event.key === 'Home') next = tabs[0];
		else if (event.key === 'End') next = tabs[tabs.length - 1];
		if (next) {
			event.preventDefault();
			next.focus();
			next.click();
		}
	}
</script>

<div bind:this={list} class="Tabs-list" role="tablist" tabindex="-1" aria-label={ariaLabel} {onkeydown}>
	{@render children()}
</div>
