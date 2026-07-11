<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The tooltip text. */
		content: string;
		/** Preferred side. Default 'top'. */
		placement?: 'top' | 'bottom' | 'left' | 'right';
		/** Delay before showing, in ms. Default 150. */
		delay?: number;
		/** The element the tooltip describes. */
		children: Snippet;
	}

	let { content, placement = 'top', delay = 150, children }: Props = $props();

	const tipId = `gabi-tooltip-${++uid}`;
	const GAP = 6;

	let trigger = $state<HTMLSpanElement>();
	let tip = $state<HTMLDivElement>();
	let open = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	/** Place the top-layer tip against the trigger for the chosen side, clamped
	 * to the viewport. */
	function place() {
		if (!trigger || !tip) return;
		const t = trigger.getBoundingClientRect();
		const m = tip.getBoundingClientRect();
		let top = 0;
		let left = 0;
		if (placement === 'top') {
			top = t.top - m.height - GAP;
			left = t.left + t.width / 2 - m.width / 2;
		} else if (placement === 'bottom') {
			top = t.bottom + GAP;
			left = t.left + t.width / 2 - m.width / 2;
		} else if (placement === 'left') {
			left = t.left - m.width - GAP;
			top = t.top + t.height / 2 - m.height / 2;
		} else {
			left = t.right + GAP;
			top = t.top + t.height / 2 - m.height / 2;
		}
		left = Math.max(GAP, Math.min(left, window.innerWidth - m.width - GAP));
		top = Math.max(GAP, Math.min(top, window.innerHeight - m.height - GAP));
		tip.style.left = `${left}px`;
		tip.style.top = `${top}px`;
	}

	function show() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (!tip) return;
			open = true;
			if (!tip.matches(':popover-open')) tip.showPopover();
			place();
		}, delay);
	}

	function hide() {
		clearTimeout(timer);
		open = false;
		if (tip?.matches(':popover-open')) tip.hidePopover();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') hide();
	}

	// Tooltips are transient — dismiss them if the page moves under them.
	$effect(() => {
		if (!open) return;
		const dismiss = () => hide();
		window.addEventListener('scroll', dismiss, true);
		window.addEventListener('resize', dismiss);
		return () => {
			window.removeEventListener('scroll', dismiss, true);
			window.removeEventListener('resize', dismiss);
		};
	});
</script>

<span
	bind:this={trigger}
	class="TooltipTrigger"
	aria-describedby={open ? tipId : undefined}
	onpointerenter={show}
	onpointerleave={hide}
	onfocusin={show}
	onfocusout={hide}
	onkeydown={onKeydown}
>
	{@render children()}
</span>

<div bind:this={tip} id={tipId} class="Tooltip" role="tooltip" popover="manual">
	{content}
</div>

<style>
	/* Wraps the trigger tightly without changing its layout. */
	.TooltipTrigger {
		display: inline-flex;
	}

	.Tooltip {
		position: fixed;
		margin: 0;
		inset: auto;
		box-sizing: border-box;
		max-width: 16rem;
		padding: 4px 8px;
		border: none;
		border-radius: 6px;
		background: var(--base-900);
		color: var(--base-0);
		font-family: inherit;
		font-size: 12px;
		line-height: 1.4;
		box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.3);
		pointer-events: none;
	}
	.Tooltip:popover-open {
		display: block;
	}
</style>
