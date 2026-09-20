import { SettingsPage } from '@/components';
import { ChoiceRow } from '@/components/onboarding';
import { usePrefs, type Appearance } from '@/store/prefs';

const OPTIONS: { key: Appearance; name: string }[] = [
  { key: 'system', name: 'System' },
  { key: 'light', name: 'Light' },
  { key: 'dark', name: 'Dark' },
];

export default function AppearanceSetting() {
  const { prefs, update } = usePrefs();
  return (
    <SettingsPage title="Appearance">
      {OPTIONS.map((o, i) => (
        <ChoiceRow key={o.key} last={i === OPTIONS.length - 1} title={o.name} selected={prefs.appearance === o.key} onPress={() => update({ appearance: o.key })} />
      ))}
    </SettingsPage>
  );
}
