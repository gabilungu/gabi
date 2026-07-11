// Ambient types for the app (not part of the published library — svelte-package
// ships only src/lib). Declares Vite's `?raw` SVG imports so they type-check
// even without vite/client types available (gabi runs sdocs with no node_modules).

declare module '*.svg?raw' {
	const content: string;
	export default content;
}
