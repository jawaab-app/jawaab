# Jawāb

A search engine for Islamic answers. Jawāb indexes answers other people wrote, so every answer carries its publisher, its scholar and its date, and the original is always one tap away.

## Stack

- Expo SDK 57 / React Native 0.86, TypeScript
- expo-router (file-based navigation)
- expo-image, expo-linear-gradient, @expo/vector-icons
- Fonts: Belleza (display) and Montserrat (body) via `@expo-google-fonts`

## Run

```bash
npm install
npm run android   # needs an Android emulator or device
npm test          # unit tests
npm run typecheck
```

The app reads answers from the Jawāb API on the DigitalOcean droplet
(`https://167-172-189-107.sslip.io`, ~98k answers). To use another backend, copy
`.env.example` to `.env.local` and change `EXPO_PUBLIC_API_URL`.

Set `ANDROID_HOME` to your SDK (`~/Library/Android/sdk` on macOS) and use the JDK bundled with Android Studio for native builds.

## Layout

```
app/                expo-router routes
  _layout.tsx       fonts, splash, root stack
  onboarding/       first run: welcome, school, topics
  (tabs)/           Home · Topics · Saved, custom pill tab bar
  answer/[id].tsx   answer reader (renders the API's JMU markup)
  browse.tsx        answers in a chapter or under a tag
  search.tsx        full-text search, filtered by the reader's school
  settings.tsx      settings (modal)
src/
  theme/            colour tokens, type scale, useTheme()
  components/       shared UI
  api/              API client, hooks, JMU parser, display formatting
  data/chapters.ts  chapters, each a curated full-text search
  data/onboarding.ts schools, languages, topics, publishers offered during setup
  store/prefs.tsx   user preferences, persisted with AsyncStorage; gates onboarding
  store/library.tsx saved answers and reading history, kept on the device
assets/images/      logo and artwork from the mockups
backend/            FastAPI + Postgres + Redis + Caddy (see backend/README.md)
```

## CI/CD

`.github/workflows/ci.yml` runs on every pull request and every push to `main`:

- **app**: typecheck, Jest, and an Android + iOS bundle.
- **backend**: pytest against real Postgres and Redis, plus a Docker build.
- **deploy backend**: only on `main`, only after both pass. It syncs `backend/`
  to the droplet and rebuilds; if `/health` fails, it rolls back to the
  previous release.

`main` is protected: changes land through a pull request, `app` and `backend`
must pass, and nobody (admins included) can push or force-push to it directly.
Deploy credentials live in the `production` environment, which only `main` can use.

## Content note

Answers come from islamqa.org's archive and are shown with their publisher, scholar and a link to the original.
