<script lang="ts">
	interface Props {
		label: string;
		type?: 'button' | 'submit' | 'reset';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		intent?: 'default' | 'mono' | 'danger' | 'warning' | 'success';
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		label,
		type = 'button',
		size = 'md',
		intent = 'default',
		disabled = false,
		onclick
	}: Props = $props();
</script>

<button {type} {disabled} {onclick} data-size={size} data-intent={intent}>{label}</button>

<style>
	button {
		border: none;
		color: white;
		cursor: pointer;
		font-family: inherit;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button[data-size='xs'] {
		height: 24px;
		padding: 0 9px;
		font-size: 11px;
		border-radius: 4px;
	}
	button[data-size='sm'] {
		height: 28px;
		padding: 0 10px;
		font-size: 13px;
		border-radius: 5px;
	}
	button[data-size='md'] {
		height: 32px;
		padding: 0 12px;
		font-size: 14px;
		border-radius: 6px;
	}
	button[data-size='lg'] {
		height: 40px;
		padding: 0 15px;
		font-size: 16px;
		border-radius: 7px;
	}

	button[data-intent='default'] {
		background: #2563eb;
	}
	button[data-intent='mono'] {
		background: #1f2937;
	}
	button[data-intent='danger'] {
		background: #dc2626;
	}
	button[data-intent='warning'] {
		background: #b45309;
	}
	button[data-intent='success'] {
		background: #15803d;
	}
</style>
