/** @type {import('sdocs').SdocsConfig} */
export default {
	// Glob pattern(s) to find sdoc files
	include: ['./src/**/*.sdoc'],

	// Dev server port (default: 3000)
	// port: 3000,

	// Open browser on start (default: false)
	// open: false,

	// CSS loaded in preview iframes
	css: './src/lib/styles/gabiLight.css',

	// Static assets served at the site root (images for pages, etc.)
	static: './static',
	content: {
		showcase: {
			contentX: 'left',
		},
		doc: {
			// maxWidth: '800px',
		},
	},

	// Header title text (default: 'sdocs')
	title: 'gabi',

	// Header logo: 'sdocs' for the mascot, an image URL, or false to hide (default: 'sdocs')
	logo: '/logo.svg',

	// Browser-tab favicon — a static path or URL (default: the sdocs icon)
	favicon: '/logo.svg',

	// The site's sections, in top-bar order; titles reference them by slug (@guides/…)
	sections: [
		{ slug: 'guides', title: 'Guides', order: ['introduction', 'colors'] },
		{
			slug: 'components',
			title: 'Components',
			// Explicit full order so the Layouts group lands last (unlisted nodes
			// would otherwise sort alphabetically *before* it).
			order: ['layout', 'display', 'form', 'icon', 'navtree', 'utils', 'layouts'],
		},
	],

	// The landing page: a sectionless [PAGE] routed at the site root
	home: 'welcome',
};
