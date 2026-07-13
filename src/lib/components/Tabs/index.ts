import Root from './Tabs.svelte';
import List from './TabsList.svelte';
import Tab from './TabsTab.svelte';
import Panel from './TabsPanel.svelte';

/** Composable tabs. Attach the parts: `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`. */
const Tabs = Object.assign(Root, { List, Tab, Panel });
export { Tabs, List, Tab, Panel };
export default Tabs;
