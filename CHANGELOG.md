# Changelog

All notable changes to gabi are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
