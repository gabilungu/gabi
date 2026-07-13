<script lang="ts">
	import { fly } from 'svelte/transition';
	import Toast from './Toast.svelte';
	import { toaster } from './toaster.svelte.js';

	interface Props {
		/** Corner the stack anchors to. Default: 'bottom-right'. */
		position?:
			| 'top-left'
			| 'top-center'
			| 'top-right'
			| 'bottom-left'
			| 'bottom-center'
			| 'bottom-right';
		/** Force a surface variant for every toast (otherwise each toast decides). */
		variant?: 'light' | 'dark';
	}

	let { position = 'bottom-right', variant }: Props = $props();

	const isTop = $derived(position.startsWith('top'));
</script>

<div class="Toaster" data-position={position}>
	{#each toaster.items as item (item.id)}
		<div class="Toaster-slot" transition:fly={{ y: isTop ? -20 : 20, duration: 220 }}>
			<Toast
				intent={item.intent}
				variant={variant ?? item.variant ?? 'light'}
				title={item.title}
				description={item.description}
				icon={item.icon}
				actionLabel={item.actionLabel}
				onAction={item.onAction}
				duration={item.duration}
				showProgress={item.showProgress}
				onClose={() => toaster.dismiss(item.id)}
			/>
		</div>
	{/each}
</div>

<style>
	.Toaster {
		position: fixed;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 16px;
		max-width: 100%;
		/* The container ignores the pointer; the toasts themselves catch it. */
		pointer-events: none;
	}
	.Toaster-slot {
		pointer-events: auto;
	}

	.Toaster[data-position='top-left'] {
		top: 0;
		left: 0;
		align-items: flex-start;
	}
	.Toaster[data-position='top-center'] {
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		align-items: center;
	}
	.Toaster[data-position='top-right'] {
		top: 0;
		right: 0;
		align-items: flex-end;
	}
	.Toaster[data-position='bottom-left'] {
		bottom: 0;
		left: 0;
		align-items: flex-start;
		flex-direction: column-reverse;
	}
	.Toaster[data-position='bottom-center'] {
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		align-items: center;
		flex-direction: column-reverse;
	}
	.Toaster[data-position='bottom-right'] {
		bottom: 0;
		right: 0;
		align-items: flex-end;
		flex-direction: column-reverse;
	}
</style>
