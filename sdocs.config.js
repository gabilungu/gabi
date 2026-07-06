/** @type {import('sdocs').SdocsConfig} */
export default {
	// Glob pattern(s) to find sdoc files
	include: ['./src/**/*.sdoc'],

	// Dev server port (default: 3000)
	// port: 3000,

	// Open browser on start (default: false)
	// open: false,

	// CSS loaded in preview iframes
	css: './src/lib/styles/global.css',

	// Static assets served at the site root (images for pages, etc.)
	static: './static',
	content: {
		docs: {
			contentX: 'left',
		},
		page: {
			// maxWidth: '800px',
		},
	},

	// Header title text (default: 'sdocs')
	title: 'gabi',

	// Header logo: 'sdocs' for the mascot, an image URL, or false to hide (default: 'sdocs')
	logo: '/logo.svg',

	// Browser-tab favicon — a static path or URL (default: the sdocs icon)
	favicon: '/logo.svg',

	// Top-bar section order — sections come from @Section/ title prefixes
	sections: ['Guides', 'Components'],

	// Sidebar configuration
	// sidebar: {
	// 	order: { root: ['Components', '*'] },
	// 	open: ['Components'],
	// },
};
