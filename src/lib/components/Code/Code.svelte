<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../Icon/Icon.svelte';
	import copyRaw from '../../internal/icons/copy.svg?raw';
	import checkRaw from '../../internal/icons/check.svg?raw';

	interface CodeFile {
		/** File name shown in the tile bar. */
		title: string;
		/** The file's contents (rendered verbatim). */
		code: string;
		/** Leading icon — a path to an SVG or raw SVG markup. */
		icon?: string;
	}

	/**
	 * @cssvar {shorthand} --bg - Code surface background (default: `var(--base-0)`)
	 * @cssvar {shorthand} --fileBg - File-bar background (default: `var(--base-50)`)
	 * @cssvar {shorthand} --border - Borders between regions (default: `1px solid var(--base-200)`)
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The files, shown as tiles in the top bar. */
		files: CodeFile[];
		/** Active file's title. Bindable — defaults to the first file. */
		value?: string;
		/** Width: 'fill' (100% of the container — the default), a number (px), or
		 * any CSS length. */
		width?: 'fill' | number | string;
		/** Surface treatment. Default: 'light'. */
		variant?: 'light' | 'dark';
		/** Max height of the code area before it scrolls. */
		maxHeight?: number | string;
		/** Show the copy button. Default: true. */
		copyable?: boolean;
	}

	let {
		files,
		value = $bindable(''),
		width = 'fill',
		variant = 'light',
		maxHeight,
		copyable = true,
		class: className = '',
		...rest
	}: Props = $props();

	const px = (v: number | string | undefined) =>
		v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

	const resolvedWidth = $derived(width === 'fill' ? '100%' : px(width));

	const active = $derived(files.find((f) => f.title === value) ?? files[0]);

	// Keep the bound value pointing at a real file (defaults to the first).
	$effect(() => {
		if (files.length && !files.some((f) => f.title === value)) value = files[0].title;
	});

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	async function copy() {
		if (!active) return;
		try {
			await navigator.clipboard.writeText(active.code);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1500);
		} catch {
			// Clipboard unavailable (e.g. blocked context) — ignore.
		}
	}
</script>

<div {...rest} class="Code {className}" data-variant={variant} style:width={resolvedWidth}>
	<div class="Code-files">
		{#each files as file (file.title)}
			<button
				type="button"
				class="Code-file"
				class:Code-active={file.title === active?.title}
				onclick={() => (value = file.title)}
			>
				{#if file.icon}<Icon icon={file.icon} dimension={16} />{/if}
				<span class="Code-file-title">{file.title}</span>
			</button>
		{/each}
	</div>

	<div class="Code-view">
		{#if copyable && active}
			<button type="button" class="Code-copy" aria-label={copied ? 'Copied' : 'Copy code'} onclick={copy}>
				<Icon icon={copied ? checkRaw : copyRaw} dimension={15} />
			</button>
		{/if}
		<pre class="Code-pre" style:max-height={px(maxHeight)}><code>{active?.code ?? ''}</code></pre>
	</div>
</div>

<style>
	.Code {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		min-width: 0;
		border-radius: 8px;
		overflow: hidden;
		font-family: var(--font-mono);
		font-size: 13px;
	}
	.Code[data-variant='light'] {
		border: var(--border, 1px solid var(--base-200));
		background: var(--bg, var(--base-0));
		color: var(--fg);
	}
	.Code[data-variant='dark'] {
		border: var(--border, 1px solid var(--base-800));
		background: var(--bg, var(--base-900));
		color: var(--base-100);
	}

	/* Top tile bar — a horizontal row of hugging file tabs. */
	.Code-files {
		flex-shrink: 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		gap: 2px;
		padding: 8px;
		min-width: 0;
		overflow-x: auto;
	}
	.Code[data-variant='light'] .Code-files {
		border-bottom: var(--border, 1px solid var(--base-200));
		background: var(--fileBg, var(--base-50));
	}
	.Code[data-variant='dark'] .Code-files {
		border-bottom: var(--border, 1px solid var(--base-800));
		background: var(--fileBg, var(--base-800));
	}

	.Code-file {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex-shrink: 0;
		box-sizing: border-box;
		padding: 5px 9px;
		border: none;
		border-radius: 6px;
		background: none;
		/* File names read as UI labels, not code. */
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 500;
		color: var(--fg-l);
		cursor: pointer;
		transition: background 0.1s ease;
	}
	.Code[data-variant='dark'] .Code-file {
		color: var(--base-400);
	}
	.Code[data-variant='light'] .Code-file:hover:not(.Code-active) {
		background: var(--base-100);
		color: var(--fg);
	}
	.Code[data-variant='dark'] .Code-file:hover:not(.Code-active) {
		background: rgb(255 255 255 / 0.08);
		color: var(--base-100);
	}
	/* Active tile uses the shared selection highlight in both variants. */
	.Code-active {
		background: var(--focus-300);
		color: var(--fg);
	}
	.Code-file-title {
		white-space: nowrap;
	}

	/* Code area */
	.Code-view {
		position: relative;
		flex: 1;
		min-height: 0;
		min-width: 0;
	}
	.Code-copy {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		cursor: pointer;
		opacity: 0.8;
	}
	.Code[data-variant='light'] .Code-copy {
		border: 1px solid var(--base-200);
		background: var(--base-0);
		color: var(--fg-l);
	}
	.Code[data-variant='dark'] .Code-copy {
		border: 1px solid var(--base-700);
		background: var(--base-800);
		color: var(--base-300);
	}
	.Code-copy:hover {
		opacity: 1;
	}
	.Code-pre {
		margin: 0;
		padding: 14px 16px;
		overflow: auto;
		line-height: 1.6;
		tab-size: 2;
		white-space: pre;
	}
	.Code-pre code {
		font-family: inherit;
	}
</style>
