<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../Icon/Icon.svelte';
	import chevronRaw from '../../internal/icons/chevron.svg?raw';
	import closeRaw from '../../internal/icons/close.svg?raw';
	import searchRaw from '../../internal/icons/search.svg?raw';

	interface Option {
		label: string;
		value: string;
	}

	type Side = 'bottom' | 'top' | 'left' | 'right';
	type Align = 'start' | 'center' | 'end';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		value?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		options?: Option[];
		intent?: 'default' | 'success' | 'warning' | 'danger';
		placeholder?: string;
		disabled?: boolean;
		/** Show a search box inside the menu that filters the options. */
		search?: boolean;
		/** Show a clear (X) button when a value is selected. */
		clearable?: boolean;
		/** Trigger width: `'fill'` (100% of the container — the default), a number
		 * (px), any CSS length, or `'auto'` to fit its content. */
		width?: 'fill' | number | string;
		/** Where the menu opens. `'auto'` opens below and flips above when there's
		 * no room; the explicit values pin a side and a cross-axis alignment. */
		placement?:
			| 'auto'
			| 'bottom-start'
			| 'bottom-center'
			| 'bottom-end'
			| 'top-start'
			| 'top-center'
			| 'top-end'
			| 'left-start'
			| 'left-center'
			| 'left-end'
			| 'right-start'
			| 'right-center'
			| 'right-end';
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		size = 'md',
		options = [],
		intent = 'default',
		placeholder,
		disabled = false,
		search = false,
		clearable = false,
		width = 'fill',
		placement = 'auto',
		onchange,
		class: className = '',
		...rest
	}: Props = $props();

	const listboxId = `gabi-select-${++uid}`;
	const GAP = 4;

	let open = $state(false);
	let activeIndex = $state(0);
	let query = $state('');

	let root = $state<HTMLDivElement>();
	let trigger = $state<HTMLDivElement>();
	let menu = $state<HTMLDivElement>();
	let searchInput = $state<HTMLInputElement>();

	const resolvedWidth = $derived(
		width === 'fill'
			? '100%'
			: typeof width === 'number'
				? `${width}px`
				: (width ?? undefined),
	);

	const selected = $derived(options.find((o) => o.value === value));
	const filtered = $derived(
		search && query.trim()
			? options.filter((o) =>
					o.label.toLowerCase().includes(query.trim().toLowerCase()),
				)
			: options,
	);
	const activeId = $derived(
		open && activeIndex >= 0 && activeIndex < filtered.length
			? `${listboxId}-opt-${activeIndex}`
			: undefined,
	);

	function showMenu() {
		if (menu && !menu.matches(':popover-open')) menu.showPopover();
	}
	function hideMenu() {
		if (menu && menu.matches(':popover-open')) menu.hidePopover();
	}

	/** Place the top-layer menu against the trigger, honouring `placement` and
	 * flipping below↔above for `auto`; the final spot is clamped to the viewport. */
	function positionMenu() {
		if (!trigger || !menu) return;
		const t = trigger.getBoundingClientRect();
		// At least as wide as the trigger, then grow to fit the widest option.
		menu.style.minWidth = `${t.width}px`;
		const m = menu.getBoundingClientRect();

		let side: Side;
		let align: Align;
		if (placement === 'auto') {
			const below = window.innerHeight - t.bottom;
			side = below < m.height && t.top > below ? 'top' : 'bottom';
			align = 'start';
		} else {
			[side, align] = placement.split('-') as [Side, Align];
		}

		const vertical = side === 'top' || side === 'bottom';
		let top = 0;
		let left = 0;

		if (side === 'bottom') top = t.bottom + GAP;
		else if (side === 'top') top = t.top - GAP - m.height;
		else if (side === 'right') left = t.right + GAP;
		else left = t.left - GAP - m.width;

		if (vertical) {
			if (align === 'start') left = t.left;
			else if (align === 'center')
				left = t.left + t.width / 2 - m.width / 2;
			else left = t.right - m.width;
		} else {
			if (align === 'start') top = t.top;
			else if (align === 'center')
				top = t.top + t.height / 2 - m.height / 2;
			else top = t.bottom - m.height;
		}

		left = Math.max(GAP, Math.min(left, window.innerWidth - m.width - GAP));
		top = Math.max(GAP, Math.min(top, window.innerHeight - m.height - GAP));

		menu.style.left = `${left}px`;
		menu.style.top = `${top}px`;
	}

	function openMenu() {
		if (disabled || open) return;
		open = true;
		const i = options.findIndex((o) => o.value === value);
		activeIndex = i >= 0 ? i : 0;
		showMenu();
		positionMenu();
		if (search) searchInput?.focus();
	}

	function closeMenu(refocus = true) {
		if (!open) return;
		open = false;
		query = '';
		hideMenu();
		if (refocus) trigger?.focus();
	}

	function toggle() {
		if (disabled) return;
		open ? closeMenu() : openMenu();
	}

	function selectOption(option: Option) {
		value = option.value;
		onchange?.(option.value);
		closeMenu();
	}

	function clear(event: MouseEvent) {
		// Don't let the click bubble to the trigger and reopen the menu.
		event.stopPropagation();
		value = '';
		onchange?.('');
		trigger?.focus();
	}

	function move(delta: number) {
		if (filtered.length === 0) return;
		activeIndex = (activeIndex + delta + filtered.length) % filtered.length;
	}

	function onKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				open ? move(1) : openMenu();
				break;
			case 'ArrowUp':
				event.preventDefault();
				open ? move(-1) : openMenu();
				break;
			case 'Home':
				if (open) {
					event.preventDefault();
					activeIndex = 0;
				}
				break;
			case 'End':
				if (open) {
					event.preventDefault();
					activeIndex = filtered.length - 1;
				}
				break;
			case 'Enter':
				event.preventDefault();
				if (open) {
					if (filtered[activeIndex])
						selectOption(filtered[activeIndex]);
				} else {
					openMenu();
				}
				break;
			case ' ':
				// Opens when closed; inside the search box it types a space.
				if (!open) {
					event.preventDefault();
					openMenu();
				}
				break;
			case 'Escape':
				if (open) {
					event.preventDefault();
					closeMenu();
				}
				break;
			case 'Tab':
				if (open) closeMenu(false);
				break;
		}
	}

	// While open: close on outside pointer, and keep the menu glued to the
	// trigger as the page scrolls or resizes.
	$effect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (root && !root.contains(event.target as Node)) closeMenu(false);
		};
		let raf = 0;
		const reposition = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(positionMenu);
		};
		document.addEventListener('pointerdown', onPointerDown, true);
		window.addEventListener('scroll', reposition, true);
		window.addEventListener('resize', reposition);
		return () => {
			cancelAnimationFrame(raf);
			document.removeEventListener('pointerdown', onPointerDown, true);
			window.removeEventListener('scroll', reposition, true);
			window.removeEventListener('resize', reposition);
		};
	});

	// Keep the active option scrolled into view.
	$effect(() => {
		if (open && activeId) {
			document
				.getElementById(activeId)
				?.scrollIntoView({ block: 'nearest' });
		}
	});
</script>

<div
	bind:this={root}
	{...rest}
	class="Select {className}"
	data-size={size}
	data-intent={intent}
	data-open={open || undefined}
	style:width={resolvedWidth}
>
	<!-- The role is always the interactive combobox or button, so tabindex is valid. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={trigger}
		class="trigger"
		role={search ? 'button' : 'combobox'}
		tabindex={disabled ? -1 : 0}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={listboxId}
		aria-activedescendant={!search && open ? activeId : undefined}
		aria-disabled={disabled || undefined}
		aria-invalid={intent === 'danger' ? 'true' : undefined}
		onclick={toggle}
		onkeydown={onKeydown}
	>
		<span class="label" data-placeholder={!selected || undefined}>
			{selected?.label ?? placeholder ?? ''}
		</span>
		<span class="affix">
			{#if clearable && selected && !disabled}
				<button
					type="button"
					class="clear"
					aria-label="Clear selection"
					onclick={clear}
				>
					<Icon icon={closeRaw} dimension={14} />
				</button>
			{/if}
			<Icon icon={chevronRaw} class="chevron" dimension={16} />
		</span>
	</div>

	<div class="menu" popover="manual" bind:this={menu}>
		{#if search}
			<div class="search">
				<Icon icon={searchRaw} dimension={16} />
				<input
					bind:this={searchInput}
					class="search-input"
					type="text"
					role="combobox"
					aria-expanded="true"
					aria-controls={listboxId}
					aria-activedescendant={activeId}
					aria-label="Search options"
					placeholder="Search…"
					bind:value={query}
					oninput={() => (activeIndex = 0)}
					onkeydown={onKeydown}
				/>
			</div>
		{/if}
		<ul id={listboxId} class="listbox" role="listbox">
			{#each filtered as option, i (option.value)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					id={`${listboxId}-opt-${i}`}
					class="option"
					role="option"
					aria-selected={option.value === value}
					data-active={i === activeIndex || undefined}
					onclick={() => selectOption(option)}
					onpointermove={() => (activeIndex = i)}
				>
					{option.label}
				</li>
			{/each}
			{#if filtered.length === 0}
				<li class="empty">No results</li>
			{/if}
		</ul>
	</div>
</div>

<style>
	.Select {
		display: inline-block;
		font-family: inherit;
	}

	/* Trigger — the field face; mirrors the other form controls. */
	.trigger {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		/* Active edge + halo colours; intents override these, and the resting
		   border stays neutral until the menu opens (or keyboard focus). */
		--_edge: var(--focus-500);
		--_ring: var(--focus-200);
		border: 1px solid var(--base-200);
		background: var(--base-0);
		color: var(--base-700);
		cursor: pointer;
		user-select: none;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	/* Halo — shown while the menu is open, or on keyboard focus. */
	.trigger:focus-visible,
	.Select[data-open] .trigger {
		border-color: var(--_edge);
		box-shadow: 0 0 0 3px var(--_ring);
	}
	/* Hover halo — only while closed and unfocused; focus/open takes over. */
	.Select:not([data-open])
		.trigger:hover:not(:focus-visible):not([aria-disabled='true']) {
		box-shadow: 0 0 0 3px var(--action-50);
	}

	.label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
	}
	.label[data-placeholder] {
		color: var(--base-350);
	}

	.affix {
		display: flex;
		align-items: center;
		gap: 2px;
		color: var(--base-400);
	}
	.clear {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 2px;
		margin: 0;
		border: none;
		border-radius: 4px;
		background: none;
		color: inherit;
		cursor: pointer;
	}
	.clear:hover {
		color: var(--base-700);
		background: var(--base-200);
	}
	/* Chevron highlights when the trigger is hovered (icon uses currentColor). */
	.trigger:hover:not([aria-disabled='true']) :global(.chevron) {
		color: var(--action-300);
	}
	/* The glyph points down; flip it up while the menu is open. */
	.Select :global(.chevron) {
		transition: transform 150ms ease;
	}
	.Select[data-open] :global(.chevron) {
		transform: rotate(180deg);
	}

	/* Validation intents colour the resting border and drive the halo. */
	.Select[data-intent='success'] .trigger {
		--_edge: var(--success-500);
		--_ring: var(--success-200);
		border-color: var(--success-500);
	}
	.Select[data-intent='warning'] .trigger {
		--_edge: var(--warning-500);
		--_ring: var(--warning-200);
		border-color: var(--warning-500);
	}
	.trigger[aria-invalid='true'] {
		--_edge: var(--danger-500);
		--_ring: var(--danger-200);
		border-color: var(--danger-500);
	}

	/* Disabled wins — neutral border, no intent colour, no halo. */
	.Select .trigger[aria-disabled='true'] {
		background: var(--base-50);
		color: var(--base-300);
		border-color: var(--base-150);
		box-shadow: none;
		cursor: not-allowed;
	}

	/* Menu — rendered in the top layer via the Popover API, positioned in JS.
	   Inheritance still follows the DOM, so it picks up the size font-size. */
	.menu {
		position: fixed;
		margin: 0;
		inset: auto;
		box-sizing: border-box;
		flex-direction: column;
		width: max-content;
		max-width: min(90vw, 24rem);
		padding: 4px;
		border: 1px solid var(--base-200);
		border-radius: 6px;
		background: var(--base-0);
		color: var(--base-700);
		box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.25);
		overflow: hidden;
		font-family: inherit;
	}
	.menu:popover-open {
		display: flex;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 6px 6px;
		margin-bottom: 4px;
		border-bottom: 1px solid var(--base-200);
		color: var(--base-400);
	}
	.search-input {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: none;
		color: var(--base-700);
		font: inherit;
	}
	.search-input::placeholder {
		color: var(--base-350);
	}

	.listbox {
		/* Size to content with its own scroll cap — not flex:1, which Safari
		   collapses to 0 height inside an intrinsically-sized popover. */
		display: flex;
		flex-direction: column;
		gap: 1px;
		margin: 0;
		padding: 0;
		list-style: none;
		max-height: 15rem;
		overflow-y: auto;
	}
	.option {
		display: flex;
		align-items: center;
		padding: 6px 8px;
		border-radius: 4px;
		color: var(--base-700);
		white-space: nowrap;
		cursor: pointer;
	}
	/* Hover / keyboard highlight is light; the selected row is stronger and,
	   ordered last, wins when it's also the highlighted one. */
	.option[data-active] {
		background: var(--action-50);
	}
	.option[aria-selected='true'] {
		background: var(--focus-300);
	}
	.empty {
		padding: 6px 8px;
		color: var(--base-400);
	}

	/* Sizes — trigger metrics per step; font-size on the root so the menu inherits it. */
	.Select[data-size='xs'] {
		font-size: 11px;
	}
	.Select[data-size='xs'] .trigger {
		height: 24px;
		padding: 0 6px;
		border-radius: 4px;
	}
	.Select[data-size='sm'] {
		font-size: 13px;
	}
	.Select[data-size='sm'] .trigger {
		height: 28px;
		padding: 0 7px;
		border-radius: 5px;
	}
	.Select[data-size='md'] {
		font-size: 14px;
	}
	.Select[data-size='md'] .trigger {
		height: 32px;
		padding: 0 8px;
		border-radius: 6px;
	}
	.Select[data-size='lg'] {
		font-size: 15px;
	}
	.Select[data-size='lg'] .trigger {
		height: 40px;
		padding: 0 10px;
		border-radius: 7px;
	}
</style>
