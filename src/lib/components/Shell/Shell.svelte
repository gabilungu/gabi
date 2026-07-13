<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade, fly } from 'svelte/transition';
	import Icon from '../Icon/Icon.svelte';
	import Scrollable from '../Scrollable/Scrollable.svelte';
	import menuRaw from '../../internal/icons/menu.svg?raw';
	import closeRaw from '../../internal/icons/close.svg?raw';

	/**
	 * @cssvar {shorthand} --bg - Shell background (default: `var(--base-0)`)
	 * @cssvar {shorthand} --border - Divider between regions (default: `1px solid var(--base-100)`)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Width: 'fill' (100% of the container — the default), a number (px), or
		 * any CSS length. */
		width?: 'fill' | number | string;
		/** Height: 'fill' (100% of the frame — the default), a number (px), or any
		 * CSS length. */
		height?: 'fill' | number | string;
		/** Desktop sidebar width — a number (px) or any CSS length. Default: 260. */
		sidebarWidth?: number | string;
		/** Container width (px) at or below which the shell switches to its mobile
		 * layout: the sidebar becomes a drawer and the sections move into it.
		 * Measured against the shell's *own* width, so it stays correct when the
		 * shell is embedded in a narrow panel. Default: 720. */
		breakpoint?: number;
		/** Desktop: whether the sidebar is collapsed (hidden). Bindable — the
		 * built-in menu button toggles it, or drive it yourself. */
		collapsed?: boolean;
		/** Mobile: whether the navigation drawer is open. Bindable. */
		menuOpen?: boolean;
		/** Top-left brand / logo. */
		brand?: Snippet;
		/** Top navigation — the horizontal sections. On mobile they move into the
		 * drawer, above the sidebar. */
		sections?: Snippet;
		/** Top-right actions (theme toggle, account, …). */
		actions?: Snippet;
		/** Left sidebar — the subsections. Becomes the drawer on mobile. */
		sidebar?: Snippet;
		/** A compact rail shown in place of the sidebar while `collapsed` (desktop)
		 * — typically icon-only nav. Without it, collapsing hides the sidebar. */
		rail?: Snippet;
		/** Width of the collapsed `rail` — a number (px) or any CSS length.
		 * Default: 56. */
		railWidth?: number | string;
		/** Main content. */
		children: Snippet;
	}

	let {
		width = 'fill',
		height = 'fill',
		sidebarWidth = 260,
		breakpoint = 720,
		collapsed = $bindable(false),
		menuOpen = $bindable(false),
		brand,
		sections,
		actions,
		sidebar,
		rail,
		railWidth = 56,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// A number becomes px; a string passes through.
	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	const resolvedWidth = $derived(width === 'fill' ? '100%' : px(width));
	const resolvedHeight = $derived(height === 'fill' ? '100%' : px(height));
	const resolvedSidebarWidth = $derived(px(sidebarWidth));
	const resolvedRailWidth = $derived(px(railWidth));
	// Slide distance for the drawer — its width, or a sensible default when the
	// width is a non-numeric CSS length.
	const drawerX = $derived(typeof sidebarWidth === 'number' ? sidebarWidth : 320);

	let root = $state<HTMLElement>();
	let containerWidth = $state(0);

	// Respond to the shell's own width (not the viewport) so it works embedded.
	$effect(() => {
		const el = root;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) containerWidth = entry.contentRect.width;
		});
		ro.observe(el);
		return () => ro.disconnect();
	});

	// Derived from the measured width, so a changed `breakpoint` re-evaluates.
	const mobile = $derived(containerWidth > 0 && containerWidth <= breakpoint);

	// A drawer left open can't linger once we're back on desktop.
	$effect(() => {
		if (!mobile && menuOpen) menuOpen = false;
	});

	// The open drawer is a modal: move focus into it, trap Tab inside, and
	// restore focus to whatever opened it (the menu button) when it closes.
	let drawerEl = $state<HTMLElement>();
	$effect(() => {
		if (!mobile || !menuOpen) return;
		const el = drawerEl;
		if (!el) return;
		const previouslyFocused = document.activeElement as HTMLElement | null;
		el.focus();
		function onTrapKeydown(event: KeyboardEvent) {
			if (event.key !== 'Tab') return;
			const focusables = [
				...el!.querySelectorAll<HTMLElement>(
					'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
				),
			].filter((n) => n.offsetParent !== null);
			if (focusables.length === 0) {
				event.preventDefault();
				return;
			}
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
		el.addEventListener('keydown', onTrapKeydown);
		return () => {
			el.removeEventListener('keydown', onTrapKeydown);
			previouslyFocused?.focus?.();
		};
	});

	const hasSidebar = $derived(!!sidebar);
	const hasSections = $derived(!!sections);
	// A leading menu button: on desktop it collapses the sidebar, on mobile it
	// opens the drawer (which carries both the sections and the sidebar).
	const showMenuButton = $derived(mobile ? hasSidebar || hasSections : hasSidebar);

	function toggleMenu() {
		if (mobile) menuOpen = !menuOpen;
		else collapsed = !collapsed;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) menuOpen = false;
	}
</script>

<svelte:window {onkeydown} />

<div
	{...rest}
	bind:this={root}
	class="Shell {className}"
	class:Shell-mobile={mobile}
	style:width={resolvedWidth}
	style:height={resolvedHeight}
>
	<header class="Shell-header">
		{#if showMenuButton}
			<button
				type="button"
				class="Shell-menu"
				aria-label={mobile
					? menuOpen
						? 'Close menu'
						: 'Open menu'
					: collapsed
						? 'Expand sidebar'
						: 'Collapse sidebar'}
				aria-expanded={mobile ? menuOpen : !collapsed}
				onclick={toggleMenu}
			>
				<Icon icon={mobile && menuOpen ? closeRaw : menuRaw} dimension={20} />
			</button>
		{/if}
		{#if brand}
			<div class="Shell-brand">{@render brand()}</div>
		{/if}
		{#if sections && !mobile}
			<nav class="Shell-sections">{@render sections()}</nav>
		{/if}
		{#if actions}
			<div class="Shell-actions">{@render actions()}</div>
		{/if}
	</header>

	<div class="Shell-body">
		{#if sidebar && !mobile}
			{#if !collapsed}
				<aside class="Shell-sidebar" style:width={resolvedSidebarWidth}>
					<Scrollable height="fill">{@render sidebar()}</Scrollable>
				</aside>
			{:else if rail}
				<aside class="Shell-rail" style:width={resolvedRailWidth}>
					{@render rail()}
				</aside>
			{/if}
		{/if}

		<main class="Shell-main">
			<Scrollable height="fill">{@render children()}</Scrollable>
		</main>

		{#if mobile && menuOpen}
			<button
				type="button"
				class="Shell-backdrop"
				aria-label="Close menu"
				onclick={() => (menuOpen = false)}
				transition:fade={{ duration: 150 }}
			></button>
			<div
				bind:this={drawerEl}
				class="Shell-drawer"
				role="dialog"
				aria-modal="true"
				aria-label="Navigation"
				tabindex="-1"
				style:width={resolvedSidebarWidth}
				transition:fly={{ x: -drawerX, duration: 200 }}
			>
				<Scrollable height="fill" padding={12} gap={12}>
					{#if sections}
						<nav class="Shell-drawer-sections">{@render sections()}</nav>
					{/if}
					{#if sections && sidebar}
						<div class="Shell-drawer-divider"></div>
					{/if}
					{#if sidebar}
						{@render sidebar()}
					{/if}
				</Scrollable>
			</div>
		{/if}
	</div>
</div>

<style>
	.Shell {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		color: var(--fg);
		background: var(--bg, var(--base-0));
		font-family: inherit;
	}

	/* Header — hug height, full width, with a leading menu button, the brand,
	   the sections, and right-aligned actions. */
	.Shell-header {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 16px;
		height: 56px;
		padding: 0 16px;
		box-sizing: border-box;
		border-bottom: var(--border, 1px solid var(--base-100));
	}

	.Shell-menu {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		margin-left: -4px;
		padding: 0;
		border: none;
		border-radius: 6px;
		background: none;
		color: inherit;
		cursor: pointer;
	}

	.Shell-menu:hover {
		background: rgb(0 0 0 / 0.06);
	}

	.Shell-menu:active {
		background: rgb(0 0 0 / 0.1);
	}

	.Shell-brand {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		font-weight: 600;
	}

	.Shell-sections {
		display: flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
	}

	.Shell-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: auto;
	}

	/* Body — fills the rest; min-height:0 lets the two columns scroll on their
	   own instead of growing the shell. Positioned so the drawer overlays it. */
	.Shell-body {
		position: relative;
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.Shell-sidebar {
		flex-shrink: 0;
		box-sizing: border-box;
		border-right: var(--border, 1px solid var(--base-100));
	}

	/* Collapsed rail — a centred, self-scrolling column of (usually icon-only)
	   nav. */
	.Shell-rail {
		flex-shrink: 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 8px 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		border-right: var(--border, 1px solid var(--base-100));
	}

	.Shell-main {
		flex: 1;
		min-width: 0;
	}

	/* Mobile drawer — slides in over the content area, below the header, with a
	   dimmed backdrop. */
	.Shell-backdrop {
		position: absolute;
		inset: 0;
		z-index: 10;
		border: none;
		padding: 0;
		background: rgb(0 0 0 / 0.4);
		cursor: pointer;
	}

	.Shell-drawer {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 11;
		max-width: 85%;
		box-sizing: border-box;
		background: var(--bg, var(--base-0));
		border-right: var(--border, 1px solid var(--base-100));
		box-shadow: 4px 0 24px rgb(0 0 0 / 0.12);
	}

	/* Focused only to seed the trap; the visible focus lives on its contents. */
	.Shell-drawer:focus {
		outline: none;
	}

	.Shell-drawer-sections {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.Shell-drawer-divider {
		height: 1px;
		background: var(--base-100);
	}
</style>
