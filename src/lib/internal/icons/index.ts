// Library-internal chrome glyphs (select caret, clear X, search). Raw .svg
// files inlined by InternalIcon and tinted with `currentColor` — NOT the public
// Icon component, which loads consumer SVGs from /static. Do not re-export from
// the package entry: these are private to the components.
export { default as InternalIcon } from './InternalIcon.svelte';
export type { IconName } from './InternalIcon.svelte';
