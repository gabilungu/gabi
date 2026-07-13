# Changelog

All notable changes to gabi are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.7] - 2026-07-13

### Added

- `Scrollable` — a scrolling flex container: `direction` / `gap` lay children
  out, `overflowX` / `overflowY` control each axis (vertical auto-scrolls),
  `width` / `height` fill by default, and `maxWidth` / `maxHeight` give a
  grow-then-scroll box. Theme the optional shell with `--bg` / `--border` /
  `--shadow`.
- `NavTree` gains `width` (fill / number / CSS), `padding`, and `margin` props.
- `NavTree.Item` gains a `size` (`xs` / `sm` / `md`, on Button's scale) and a
  leading `icon`; its folder chevron is now an independent toggle button (its
  own hover / press), and the selected item is highlighted with `--focus-300`.

### Changed

- **Breaking:** `Container` drops the `overflow` prop — wrap content in a
  `Scrollable` instead.
- **Breaking:** `NavTree.Item` renames `label` to `text` (matching Button) and
  replaces its `left` snippet with the `icon` prop.
- The `NavTree` family no longer exposes the ad-hoc `--p` / `--m` / `--r` /
  `--b` / `--font-color` custom properties.

## [0.0.6] - 2026-07-11

### Added

- Layout primitives with no styling props — theme them through the `--bg`,
  `--fg`, `--border`, and `--shadow` custom properties:
  - `Container` — a styled surface (padding, radius, sizing, overflow).
  - `Divider` — a horizontal or vertical rule.
  - `Flex` — a 1D layout with physical `contentX` / `contentY` (they stay
    horizontal / vertical across `direction`), `gap` / `padding` / `margin`,
    `width`, `wrap`, and per-element `grow` / `shrink` (`boolean | number`).
  - `Grid` — a 2D layout sharing Flex's props, plus `columns` / `rows` /
    `rowGap` and a `Grid.Cell` compound for `colSpan` / `rowSpan`.
- `Text` — type presets (`h1`–`h6`, `body`, `important`, `small`, `caption`)
  with `size` / `weight` / `lineHeight` / `family` overrides and a `--color`
  custom property.
- `FormField` — wraps a single control with a label, a right-aligned hint, and
  helper text on either side (each with an optional icon), and an `intent` that
  colours the helper.
- `width` on `Input`; `icon`, optional `text`, and `alignContent` on `Button`.
- `--bg` / `--fg` custom properties and a `radius` prop on `Placeholder`.

### Changed

- `Badge` drops `intent` / `variant` in favour of `--bg` / `--fg` custom
  properties, and renames `label` to `text`.

### Fixed

- `Chip`'s `onselect` prop no longer conflicts with the native handler type.

## [0.0.5] - 2026-07-09

### Added

- `placement` on Select — `'auto'` (opens below, flips above when there's no
  room) plus the twelve explicit `side-alignment` values (`bottom-start` …
  `right-end`).
- `width` on Select — `'fill'` (the default, 100% of the container), a number
  (px), any CSS length, or `'auto'` to fit its content.

### Changed

- Select's menu now renders in the top layer via the Popover API, so it's no
  longer clipped by an ancestor's `overflow`; it's positioned in JS with
  auto-flip and viewport clamping, and the trigger shows an intent-coloured
  halo while the menu is open.

## [0.0.4] - 2026-07-09

### Changed

- Renamed the style export `gabi/global.css` to `gabi/gabiLight.css` — the
  theme stylesheet is now named for the theme it carries, making room for
  further themes. Update imports to `import 'gabi/gabiLight.css'`.
- Button, Input, Select, and Textarea now draw their backgrounds, text,
  borders, and focus rings from the theme's colour tokens instead of hard-coded
  values, so they follow the active theme.
- Select is now a custom combobox — a styled drop-down menu with full keyboard
  navigation and optional `search` and `clearable` — replacing the native
  `<select>`. The options API is unchanged.

### Added

- `intent` on Input, Select, and Textarea for validation states: `success` and
  `warning` (presentational) and `danger`, which also sets `aria-invalid`; the
  invalid styling keys off `aria-invalid`, so form-library validation lights it
  up too.
- Button gains a `variant` (`solid` / `outline` / `ghost`) alongside its
  `intent`s, with hover, active, and focus-visible states.
- An extra light (`-llll`) and dark (`-dddd`) step on each colour ramp, and a
  new `--warning` ramp.

## [0.0.3] - 2026-07-05

### Changed

- The published package no longer includes the `.sdoc` documentation files.

### Added

- `gabi/global.css` export — import it to load the self-hosted Figtree and
  JetBrains Mono fonts and apply the type styles.

## [0.0.2] - 2026-07-05

### Added

- **Button** — sizes (`xs`–`lg`) and intents (`default`, `mono`, `danger`,
  `warning`, `success`).
- **Input**, **Textarea**, and **Select** — built on the same size scale.
- Self-hosted **Figtree** and **JetBrains Mono** fonts.
