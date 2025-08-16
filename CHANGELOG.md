# Changelog

All notable changes to **Voice UI Kit** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[0.2.0]

Various visual enhancements, primitve additions and CSS variables in support of more flexible theming.

- Change: switched to pnpm for better workspace management
- Added: out of the box themes e.g. [05-theme](examples/05-theme)
- Added: Badge primitive
- Added: Progress primitive
- Added: Divider
- Added: Additional card variants and decorations
- Added: `StripeLoader`
- Added: TW4 utilities to shadow classes to allow overrides in external themes.
- Change: `AudioClientHelper` renamed to `PipecatAppBase`. Previous name exported to prevent a breaking change, but will eventually be deprecated.
    - Now accepts both React Node children as well as a functional list for prop injection. If passing renderables, client methods can be accessed directly on the context's client via Pipecat React hooks (e.g. `usePipecatClient`).
    - Added `noThemeProvider` prop to optionally disable theme provider wrapping.
    - Made connection handlers (`handleConnect`, `handleDisconnect`) compatible with both sync and async functions.
    - Enhanced error handling and loading states for better developer experience.
    - Returns the `client` object in child props.
    - Fixed TypeScript component type definition to resolve JSX usage errors.
- Change: `LoaderSpinner` component from `components/ui/loaders` has been renamed to `SpinLoader` to establish a naming convention for future loaders.
- Change: `Cards` primitive no longer pads based on media queries for flexibility
- Change: `css/components.css` split from main `index.css`
- Improved:`ErrorCard` allows for cascading classNames for Card elements and passing of custom icon component.
- Fixed: `tailwind-merge` needs extensions for custom shadow-* class names, which have no been applied.
- Fixed: CSS nits to address border overlap for button groups when in dark mode.
- Fixed: User audio control no longer shrinks in flex mode 
