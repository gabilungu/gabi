<script lang="ts">
	import { getContext } from 'svelte';
	import { TABLE_KEY, type TableContext } from './context.js';
	import Button from '../Button/Button.svelte';

	interface Props {
		/** Total number of rows across all pages (you provide it — the table only
		 * sees the current page). */
		total?: number;
	}

	let { total = 0 }: Props = $props();

	const ctx = getContext<TableContext>(TABLE_KEY);

	const pageCount = $derived(Math.max(1, Math.ceil(total / ctx.pageSize)));
	const from = $derived(total === 0 ? 0 : (ctx.page - 1) * ctx.pageSize + 1);
	const to = $derived(Math.min(total, ctx.page * ctx.pageSize));
</script>

<tfoot class="Table-foot">
	<tr>
		<td colspan={Math.max(1, ctx.colCount)} class="Table-pager-cell">
			<div class="Table-pager">
				<span class="Table-pager-info">{from}–{to} of {total}</span>
				<div class="Table-pager-controls">
					<Button
						size="sm"
						variant="ghost"
						text="Prev"
						onclick={() => (ctx.page = Math.max(1, ctx.page - 1))}
						disabled={ctx.page <= 1}
					/>
					<span class="Table-pager-page">{ctx.page} / {pageCount}</span>
					<Button
						size="sm"
						variant="ghost"
						text="Next"
						onclick={() => (ctx.page = Math.min(pageCount, ctx.page + 1))}
						disabled={ctx.page >= pageCount}
					/>
				</div>
			</div>
		</td>
	</tr>
</tfoot>
