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
npm run android   # builds the dev client and installs it on the running emulator or device
```

The first build takes a few minutes and creates `android/` (ignored by git). After that, `npx expo start --dev-client` alone is enough; the installed app reloads from Metro.

Expo Go no longer runs the app: voice search uses a native module (`expo-speech-recognition`) that Expo Go doesn't bundle.

Set `ANDROID_HOME` to your SDK (`~/Library/Android/sdk` on macOS) and `JAVA_HOME` to the JDK bundled with Android Studio.

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
