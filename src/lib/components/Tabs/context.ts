export const TABS_KEY = Symbol('gabi-tabs');

export type TabsSize = 'xs' | 'sm' | 'md' | 'lg';

export interface TabsContext {
	/** The active tab's value. */
	readonly value: string;
	/** Size preset — shares Button's height scale. */
	readonly size: TabsSize;
	/** Activate a tab. */
	select(value: string): void;
	/** A tab registers itself; the first one activates when nothing is set yet. */
	registerTab(value: string): void;
}
