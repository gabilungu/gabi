<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { tick } from 'svelte';
	import { InternalIcon } from '../../internal/icons';

	interface Option {
		label: string;
		value: string;
	}

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
		onchange,
		class: className = '',
		...rest
	}: Props = $props();

	const listboxId = `gabi-select-${++uid}`;

	let open = $state(false);
	let activeIndex = $state(0);
	let query = $state('');

	let root = $state<HTMLDivElement>();
	let trigger = $state<HTMLDivElement>();
	let searchInput = $state<HTMLInputElement>();

	const selected = $derived(options.find((o) => o.value === value));
	const filtered = $derived(
		search && query.trim()
			? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
			: options,
	);
	const activeId = $derived(
		open && activeIndex >= 0 && activeIndex < filtered.length
			? `${listboxId}-opt-${activeIndex}`
			: undefined,
	);

	function openMenu() {
		if (disabled || open) return;
		open = true;
		const i = options.findIndex((o) => o.value === value);
		activeIndex = i >= 0 ? i : 0;
		if (search) tick().then(() => searchInput?.focus());
	}

	function closeMenu(refocus = true) {
		if (!open) return;
		open = false;
		query = '';
		if (refocus) tick().then(() => trigger?.focus());
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
					if (filtered[activeIndex]) selectOption(filtered[activeIndex]);
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

	// Close on any pointer press outside the component.
	$effect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (root && !root.contains(event.target as Node)) closeMenu(false);
		};
		document.addEventListener('pointerdown', onPointerDown, true);
		return () => document.removeEventListener('pointerdown', onPointerDown, true);
	});

	// Keep the active option scrolled into view.
	$effect(() => {
		if (open && activeId) {
			document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
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
		aria-controls={open ? listboxId : undefined}
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
				<button type="button" class="clear" aria-label="Clear selection" onclick={clear}>
					<InternalIcon icon="close" size={14} />
				</button>
			{/if}
			<InternalIcon icon="chevron" direction={open ? 'up' : 'down'} size={16} />
		</span>
	</div>

	{#if open}
		<div class="menu">
			{#if search}
				<div class="search">
					<InternalIcon icon="search" size={16} />
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
	{/if}
</div>

<style>
	.Select {
		position: relative;
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
		border: 1px solid var(--bg-ddd);
		background: var(--bg-l);
		color: var(--fg);
		cursor: pointer;
		user-select: none;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	.trigger:focus-visible {
		border-color: var(--focus);
		box-shadow: 0 0 0 3px var(--focus-ll);
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
		color: var(--fg-lll);
	}

	.affix {
		display: flex;
		align-items: center;
		gap: 2px;
		color: var(--fg-lll);
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
		color: var(--fg);
		background: var(--bg-dd);
	}

	/* Validation — success/warning via intent, invalid via aria-invalid. */
	.Select[data-intent='success'] .trigger {
		border-color: var(--success);
	}
	.Select[data-intent='success'] .trigger:focus-visible {
		box-shadow: 0 0 0 3px var(--success-llll);
	}
	.Select[data-intent='warning'] .trigger {
		border-color: var(--warning);
	}
	.Select[data-intent='warning'] .trigger:focus-visible {
		box-shadow: 0 0 0 3px var(--warning-llll);
	}
	.trigger[aria-invalid='true'] {
		border-color: var(--danger);
	}
	.trigger[aria-invalid='true']:focus-visible {
		box-shadow: 0 0 0 3px var(--danger-llll);
	}

	/* Disabled wins over the validation intents. */
	.trigger[aria-disabled='true'] {
		background: var(--disabled-lll);
		color: var(--disabled-dd);
		border-color: var(--disabled-l);
		cursor: not-allowed;
	}

	/* Menu — drops directly under the field, with its own padding. */
	.menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		z-index: 50;
		display: flex;
		flex-direction: column;
		max-height: 16rem;
		padding: 4px;
		border: 1px solid var(--bg-ddd);
		border-radius: 6px;
		background: var(--bg-l);
		box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.25);
		overflow: hidden;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 6px 6px;
		margin-bottom: 4px;
		border-bottom: 1px solid var(--bg-dd);
		color: var(--fg-lll);
	}
	.search-input {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: none;
		color: var(--fg);
		font: inherit;
	}
	.search-input::placeholder {
		color: var(--fg-lll);
	}

	.listbox {
		flex: 1;
		margin: 0;
		padding: 0;
		list-style: none;
		overflow-y: auto;
	}
	.option {
		display: flex;
		align-items: center;
		padding: 6px 8px;
		border-radius: 4px;
		color: var(--fg);
		white-space: nowrap;
		cursor: pointer;
	}
	.option[data-active] {
		background: var(--bg-dd);
	}
	.option[aria-selected='true'] {
		color: var(--action);
		font-weight: 600;
	}
	.empty {
		padding: 6px 8px;
		color: var(--fg-lll);
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
