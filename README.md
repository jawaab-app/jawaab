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
```

Set `ANDROID_HOME` to your SDK (`~/Library/Android/sdk` on macOS) and use the JDK bundled with Android Studio for native builds.

## Layout

```
app/                expo-router routes
  _layout.tsx       fonts, splash, root stack
  onboarding/       first run: welcome, school, topics
  (tabs)/           Home · Topics · Saved, custom pill tab bar
  answer/[id].tsx   answer reader
  search.tsx        search
  settings.tsx      settings (modal)
src/
  theme/            colour tokens, type scale, useTheme()
  components/       shared UI
  data/sample.ts    placeholder content for layout only
  data/onboarding.ts schools, languages, topics, publishers offered during setup
  store/prefs.tsx   user preferences, persisted with AsyncStorage; gates onboarding
assets/images/      logo and artwork from the mockups
```

## Content note

Publisher names in the sample data are real index targets, but every answer, byline, date and number is placeholder text written for layout. Replace all of it with real records before showing the app to a publisher.
