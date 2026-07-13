export type ToastIntent = 'neutral' | 'info' | 'success' | 'danger' | 'warning';

export interface ToastOptions {
	intent?: ToastIntent;
	variant?: 'light' | 'dark';
	title?: string;
	description?: string;
	icon?: string | null;
	actionLabel?: string;
	onAction?: () => void;
	/** Auto-dismiss after this many seconds; `null` keeps it until dismissed.
	 * Default: 5. */
	duration?: number | null;
	showProgress?: boolean;
}

export interface ToastItem extends ToastOptions {
	id: number;
}

let counter = 0;

/** The toast queue — mount one `<Toaster />` and call these from anywhere. */
class ToasterStore {
	items = $state<ToastItem[]>([]);

	/** Enqueue a toast; returns its id (pass to `dismiss`). */
	show(options: ToastOptions): number {
		const id = ++counter;
		this.items.push({ duration: 5, ...options, id });
		return id;
	}

	neutral = (title: string, description?: string, options: ToastOptions = {}) =>
		this.show({ intent: 'neutral', title, description, ...options });
	info = (title: string, description?: string, options: ToastOptions = {}) =>
		this.show({ intent: 'info', title, description, ...options });
	success = (title: string, description?: string, options: ToastOptions = {}) =>
		this.show({ intent: 'success', title, description, ...options });
	danger = (title: string, description?: string, options: ToastOptions = {}) =>
		this.show({ intent: 'danger', title, description, ...options });
	warning = (title: string, description?: string, options: ToastOptions = {}) =>
		this.show({ intent: 'warning', title, description, ...options });

	/** Remove a toast by id. */
	dismiss(id: number) {
		this.items = this.items.filter((t) => t.id !== id);
	}

	/** Remove all toasts. */
	clear() {
		this.items = [];
	}
}

export const toaster = new ToasterStore();
