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
		border-radius: 6px;
		padding-inline: 12px;
		color: white;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button[data-size='xs'] {
		height: 24px;
	}
	button[data-size='sm'] {
		height: 28px;
	}
	button[data-size='md'] {
		height: 32px;
	}
	button[data-size='lg'] {
		height: 40px;
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
