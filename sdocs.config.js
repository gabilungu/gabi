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
			maxWidth: '800px',
		},
	},

	// Sidebar logo text (default: 'sdocs')
	// logo: 'sdocs',

	// Sidebar logo icon: 'sdocs' for the mascot, an image URL, or false to hide (default: 'sdocs')
	// icon: 'sdocs',

	// Sidebar configuration
	// sidebar: {
	// 	order: { root: ['Components', '*', 'Documentation'] },
	// 	open: ['Components'],
	// },
};
