<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../Icon/Icon.svelte';
	import closeRaw from '../../internal/icons/close.svg?raw';
	import infoRaw from '../../internal/icons/info.svg?raw';
	import circleCheckRaw from '../../internal/icons/circle-check.svg?raw';
	import circleAlertRaw from '../../internal/icons/circle-alert.svg?raw';
	import triangleAlertRaw from '../../internal/icons/triangle-alert.svg?raw';
	import type { ToastIntent } from './toaster.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Semantic colour — tints the icon and the progress line. Default: 'info'. */
		intent?: 'neutral' | 'info' | 'success' | 'danger' | 'warning';
		/** Surface treatment. Default: 'light'. */
		variant?: 'light' | 'dark';
		/** Bold heading line. */
		title?: string;
		/** Supporting body text (or use the `children` snippet). */
		description?: string;
		/** Leading icon: a path / raw SVG to override the intent's default, or
		 * `null` for no icon. */
		icon?: string | null;
		/** Show the ✕ and call this on dismiss (click, or the timer running out). */
		onClose?: () => void;
		/** Trailing action label. */
		actionLabel?: string;
		/** Action click handler. */
		onAction?: () => void;
		/** Auto-dismiss after this many seconds (`null` = sticky). Needs `onClose`. */
		duration?: number | null;
		/** Show the depleting countdown line (needs a finite `duration`). */
		showProgress?: boolean;
		/** Body text, as an alternative to `description`. */
		children?: Snippet;
	}

	let {
		intent = 'info',
		variant = 'light',
		title,
		description,
		icon,
		onClose,
		actionLabel,
		onAction,
		duration = null,
		showProgress = true,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const intentIcon: Record<ToastIntent, string> = {
		neutral: infoRaw,
		info: infoRaw,
		success: circleCheckRaw,
		danger: circleAlertRaw,
		warning: triangleAlertRaw,
	};
	const resolvedIcon = $derived(icon === null ? null : (icon ?? intentIcon[intent]));

	const hasProgress = $derived(showProgress && duration != null && duration > 0);

	// Auto-dismiss timer that pauses while hovered/focused, tracking the time
	// left so the visible progress line and the dismissal stay in sync.
	let remaining = 0;
	let startedAt = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	function startTimer() {
		if (duration == null || duration <= 0 || !onClose || timer) return;
		startedAt = performance.now();
		timer = setTimeout(() => onClose?.(), remaining);
	}
	function pauseTimer() {
		if (!timer) return;
		clearTimeout(timer);
		timer = undefined;
		remaining -= performance.now() - startedAt;
	}

	$effect(() => {
		if (duration == null || duration <= 0 || !onClose) return;
		remaining = duration * 1000;
		startTimer();
		return () => {
			if (timer) clearTimeout(timer);
			timer = undefined;
		};
	});
</script>

<div
	{...rest}
	class="Toast {className}"
	data-intent={intent}
	data-variant={variant}
	role="status"
	aria-live="polite"
	onpointerenter={pauseTimer}
	onpointerleave={startTimer}
	onfocusin={pauseTimer}
	onfocusout={startTimer}
>
	{#if resolvedIcon}
		<span class="Toast-icon"><Icon icon={resolvedIcon} dimension={18} /></span>
	{/if}

	<div class="Toast-body">
		{#if title}<div class="Toast-title">{title}</div>{/if}
		{#if children}
			<div class="Toast-text">{@render children()}</div>
		{:else if description}
			<div class="Toast-text">{description}</div>
		{/if}
		{#if actionLabel}
			<button type="button" class="Toast-action" onclick={onAction}>{actionLabel}</button>
		{/if}
	</div>

	{#if onClose}
		<button type="button" class="Toast-close" aria-label="Dismiss" onclick={() => onClose?.()}>
			<Icon icon={closeRaw} dimension={16} />
		</button>
	{/if}

	{#if hasProgress}
		<span class="Toast-progress" style:animation-duration={`${duration}s`}></span>
	{/if}
</div>

<style>
	.Toast {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 12px;
		box-sizing: border-box;
		width: 100%;
		max-width: 380px;
		padding: 14px 16px;
		border-radius: 10px;
		overflow: hidden;
		font-size: 14px;
		line-height: 1.45;
	}
	.Toast[data-variant='light'] {
		background: var(--base-0);
		color: var(--fg);
		border: 1px solid var(--base-150);
		box-shadow: 0 6px 24px rgb(0 0 0 / 0.1);
	}
	/* Dark variant: a deep, intent-coloured surface. */
	.Toast[data-variant='dark'] {
		color: var(--base-0);
		border: 1px solid rgb(255 255 255 / 0.14);
		box-shadow: 0 6px 24px rgb(0 0 0 / 0.3);
	}
	.Toast[data-variant='dark'][data-intent='neutral'] {
		background: var(--base-900);
	}
	.Toast[data-variant='dark'][data-intent='info'] {
		background: var(--info-800);
	}
	.Toast[data-variant='dark'][data-intent='success'] {
		background: var(--success-800);
	}
	.Toast[data-variant='dark'][data-intent='danger'] {
		background: var(--danger-800);
	}
	.Toast[data-variant='dark'][data-intent='warning'] {
		background: var(--warning-800);
	}

	.Toast-icon {
		display: inline-flex;
		flex-shrink: 0;
		margin-top: 1px;
	}
	.Toast[data-intent='neutral'] .Toast-icon {
		color: var(--fg-l);
	}
	.Toast[data-intent='info'] .Toast-icon {
		color: var(--info-500);
	}
	.Toast[data-intent='success'] .Toast-icon {
		color: var(--success-500);
	}
	.Toast[data-intent='danger'] .Toast-icon {
		color: var(--danger-500);
	}
	.Toast[data-intent='warning'] .Toast-icon {
		color: var(--warning-500);
	}
	/* On the coloured dark surface the intent already reads, so the icon is white. */
	.Toast[data-variant='dark'] .Toast-icon {
		color: var(--base-0);
	}

	.Toast-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.Toast-title {
		font-weight: 600;
	}
	.Toast-text {
		color: var(--fg-l);
	}
	.Toast[data-variant='dark'] .Toast-text {
		color: rgb(255 255 255 / 0.75);
	}

	.Toast-action {
		align-self: flex-start;
		margin-top: 6px;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		font-weight: 600;
		color: var(--action-600);
		cursor: pointer;
	}
	.Toast[data-variant='dark'] .Toast-action {
		color: var(--base-0);
	}
	.Toast-action:hover {
		text-decoration: underline;
	}

	.Toast-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		margin: -4px -6px -4px 0;
		padding: 0;
		border: none;
		border-radius: 5px;
		background: none;
		color: inherit;
		opacity: 0.6;
		cursor: pointer;
	}
	.Toast-close:hover {
		opacity: 1;
		background: rgb(128 128 128 / 0.15);
	}

	.Toast-progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		transform-origin: left;
		animation-name: toast-deplete;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
	.Toast[data-intent='neutral'] .Toast-progress {
		background: var(--base-400);
	}
	.Toast[data-intent='info'] .Toast-progress {
		background: var(--info-500);
	}
	.Toast[data-intent='success'] .Toast-progress {
		background: var(--success-500);
	}
	.Toast[data-intent='danger'] .Toast-progress {
		background: var(--danger-500);
	}
	.Toast[data-intent='warning'] .Toast-progress {
		background: var(--warning-500);
	}
	.Toast[data-variant='dark'] .Toast-progress {
		background: rgb(255 255 255 / 0.4);
	}
	/* Pause the countdown while the toast is hovered or focused. */
	.Toast:hover .Toast-progress,
	.Toast:focus-within .Toast-progress {
		animation-play-state: paused;
	}

	@keyframes toast-deplete {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
</style>
