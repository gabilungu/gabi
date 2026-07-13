<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../Icon/Icon.svelte';
	import chevronLeft from '../../internal/icons/chevron-left.svg?raw';
	import chevronRight from '../../internal/icons/chevron-right.svg?raw';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Current page, 1-based. Bindable. */
		page?: number;
		/** Total number of items — with `pageSize`, gives the page count. */
		total?: number;
		/** Items per page. Default: 10. */
		pageSize?: number;
		/** Page count directly — overrides `total` / `pageSize` when set. */
		pageCount?: number;
		/** Pages shown on each side of the current one. Default: 1. */
		siblingCount?: number;
		/** Pages pinned at each end. Default: 1. */
		boundaryCount?: number;
		/** Size preset — heights match Button's scale. Default: 'md'. */
		size?: 'xs' | 'sm' | 'md' | 'lg';
		disabled?: boolean;
	}

	let {
		page = $bindable(1),
		total = 0,
		pageSize = 10,
		pageCount,
		siblingCount = 1,
		boundaryCount = 1,
		size = 'md',
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	const count = $derived(pageCount ?? Math.max(1, Math.ceil((total || 0) / (pageSize || 1))));
	const iconSize = $derived(({ xs: 14, sm: 15, md: 16, lg: 18 })[size]);

	const range = (start: number, end: number) =>
		Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

	// The list of page numbers + ellipsis markers (the WAI/MUI algorithm).
	const items = $derived.by(() => {
		const startPages = range(1, Math.min(boundaryCount, count));
		const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

		const siblingsStart = Math.max(
			Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
			boundaryCount + 2,
		);
		const siblingsEnd = Math.min(
			Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
			endPages.length > 0 ? endPages[0] - 2 : count - 1,
		);

		return [
			...startPages,
			...(siblingsStart > boundaryCount + 2
				? ['ellipsis' as const]
				: boundaryCount + 1 < count - boundaryCount
					? [boundaryCount + 1]
					: []),
			...range(siblingsStart, siblingsEnd),
			...(siblingsEnd < count - boundaryCount - 1
				? ['ellipsis' as const]
				: count - boundaryCount > boundaryCount
					? [count - boundaryCount]
					: []),
			...endPages,
		];
	});

	function go(p: number) {
		const next = Math.min(Math.max(p, 1), count);
		if (next !== page) page = next;
	}
</script>

<nav {...rest} class="Pagination {className}" data-size={size} aria-label="Pagination">
	<button
		type="button"
		class="Pagination-item Pagination-nav"
		aria-label="Previous page"
		disabled={disabled || page <= 1}
		onclick={() => go(page - 1)}
	>
		<Icon icon={chevronLeft} dimension={iconSize} />
	</button>

	{#each items as item, i (typeof item === 'number' ? `p${item}` : `e${i}`)}
		{#if item === 'ellipsis'}
			<span class="Pagination-ellipsis" aria-hidden="true">…</span>
		{:else}
			<button
				type="button"
				class="Pagination-item Pagination-page"
				class:Pagination-current={item === page}
				aria-label={`Go to page ${item}`}
				aria-current={item === page ? 'page' : undefined}
				{disabled}
				onclick={() => go(item)}
			>
				{item}
			</button>
		{/if}
	{/each}

	<button
		type="button"
		class="Pagination-item Pagination-nav"
		aria-label="Next page"
		disabled={disabled || page >= count}
		onclick={() => go(page + 1)}
	>
		<Icon icon={chevronRight} dimension={iconSize} />
	</button>
</nav>

<style>
	.Pagination {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--fg);
	}

	.Pagination-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border: none;
		background: none;
		font-family: inherit;
		font-weight: 500;
		color: var(--fg-l);
		cursor: pointer;
		transition:
			background 0.12s ease,
			color 0.12s ease;
	}
	.Pagination-item:hover:not(:disabled):not(.Pagination-current) {
		background: var(--base-100);
		color: var(--fg);
	}
	.Pagination-current {
		background: var(--focus-300);
		color: var(--fg);
		cursor: default;
	}
	.Pagination-item:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.Pagination-item:focus-visible {
		outline: 2px solid var(--focus-500, var(--action-600));
		outline-offset: -2px;
	}

	.Pagination-ellipsis {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--fg-ll);
		user-select: none;
	}

	/* Size presets — square buttons whose height matches Button (xs 24 / sm 28 /
	   md 32 / lg 40). */
	.Pagination[data-size='xs'] .Pagination-item,
	.Pagination[data-size='xs'] .Pagination-ellipsis {
		min-width: 24px;
		height: 24px;
		padding: 0 4px;
		font-size: 12px;
		border-radius: 4px;
	}
	.Pagination[data-size='sm'] .Pagination-item,
	.Pagination[data-size='sm'] .Pagination-ellipsis {
		min-width: 28px;
		height: 28px;
		padding: 0 5px;
		font-size: 13px;
		border-radius: 5px;
	}
	.Pagination[data-size='md'] .Pagination-item,
	.Pagination[data-size='md'] .Pagination-ellipsis {
		min-width: 32px;
		height: 32px;
		padding: 0 6px;
		font-size: 14px;
		border-radius: 6px;
	}
	.Pagination[data-size='lg'] .Pagination-item,
	.Pagination[data-size='lg'] .Pagination-ellipsis {
		min-width: 40px;
		height: 40px;
		padding: 0 8px;
		font-size: 16px;
		border-radius: 7px;
	}
</style>
