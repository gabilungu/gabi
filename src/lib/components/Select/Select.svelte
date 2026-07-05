<script lang="ts">
	interface Option {
		label: string;
		value: string;
	}

	interface Props {
		value?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		options?: Option[];
		placeholder?: string;
		disabled?: boolean;
	}

	let {
		value = $bindable(''),
		size = 'md',
		options = [],
		placeholder,
		disabled = false
	}: Props = $props();
</script>

<select {disabled} data-size={size} bind:value>
	{#if placeholder}
		<option value="" disabled>{placeholder}</option>
	{/if}
	{#each options as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>

<style>
	select {
		box-sizing: border-box;
		border: 1px solid #d1d5db;
		background: #fff;
		color: #111827;
		font-family: inherit;
		line-height: 1;
		cursor: pointer;
		outline: none;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	select:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
	}
	select:disabled {
		background: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}

	select[data-size='xs'] {
		height: 24px;
		padding: 0 6px;
		font-size: 11px;
		border-radius: 4px;
	}
	select[data-size='sm'] {
		height: 28px;
		padding: 0 7px;
		font-size: 13px;
		border-radius: 5px;
	}
	select[data-size='md'] {
		height: 32px;
		padding: 0 8px;
		font-size: 14px;
		border-radius: 6px;
	}
	select[data-size='lg'] {
		height: 40px;
		padding: 0 10px;
		font-size: 15px;
		border-radius: 7px;
	}
</style>
