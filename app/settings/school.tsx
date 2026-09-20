import { SettingsPage } from '@/components';
import { ChoiceRow } from '@/components/onboarding';
import { SCHOOLS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function SchoolSetting() {
  const { prefs, update } = usePrefs();
  return (
    <SettingsPage title="School" hint="Answers from your school come first.">
      {SCHOOLS.map((s, i) => (
        <ChoiceRow key={s.key} last={i === SCHOOLS.length - 1} title={s.name} selected={prefs.school === s.key} onPress={() => update({ school: s.key })} />
      ))}
    </SettingsPage>
  );
}
