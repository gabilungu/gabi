# gabi

A Svelte 5 component library and design system.

[**Try it in the Svelte playground →**](https://svelte.dev/playground/4c35aab4de2343b4adfacf70bdd034ac)

## Install

```sh
npm install gabi
```

Requires Svelte 5 as a peer dependency.

## Usage

```svelte
<script>
  import { Button, Input, Textarea, Select } from 'gabi';
</script>

<Button label="Save" intent="success" size="md" />
<Input placeholder="Email" size="md" />
```

## Fonts

gabi self-hosts Figtree (text) and JetBrains Mono (mono). Import a theme
stylesheet once — it loads the fonts and applies the type styles and colour
tokens:

```js
import 'gabi/gabiLight.css';
```

## Development

```sh
npm run check    # type-check
npm run prepack  # build the library into dist/
```

Everything in `src/lib` is the published library. Preview and document the
components with [sdocs](https://github.com/gabilungu/sdocs):

```sh
npx sdocs dev
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## License

MIT
