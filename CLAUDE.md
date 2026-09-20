# Jawāb

Expo SDK 57 + expo-router app. Read AGENTS.md before writing Expo code.

- Design tokens live in `src/theme/tokens.ts`. White canvas, hairline separators, black pill buttons. Colour is a signal, not decoration. Never use system blue.
- One font, Inter Tight, with negative tracking. Arabic uses the system font.
- Home sky art by time of day lives in `assets/images/sky/`, mapped in `src/theme/sky.ts`. Settings → Developer overrides it for testing.
- Path alias `@/*` maps to `src/*`.
- Sample content in `src/data/sample.ts` is placeholder only.
- Commits: plain messages, no co-author or generated-by trailers.
