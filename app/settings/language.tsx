import { SettingsPage } from '@/components';
import { ChoiceRow } from '@/components/onboarding';
import { LANGUAGES } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function LanguageSetting() {
  const { prefs, update } = usePrefs();
  return (
    <SettingsPage title="Language" hint="Answers in this language come first.">
      {LANGUAGES.map((l, i) => (
        <ChoiceRow key={l.key} last={i === LANGUAGES.length - 1} title={l.name} trailing={l.native !== l.name ? l.native : undefined} selected={prefs.language === l.key} onPress={() => update({ language: l.key })} />
      ))}
    </SettingsPage>
  );
}
