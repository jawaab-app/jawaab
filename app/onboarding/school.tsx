import { useRouter } from 'expo-router';
import { ChoiceRow, OnboardingFrame } from '@/components/onboarding';
import { SCHOOLS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function SchoolScreen() {
  const router = useRouter();
  const { prefs, update } = usePrefs();
  const next = () => router.push('/onboarding/topics');

  return (
    <OnboardingFrame
      step={1}
      title="Your school"
      primaryLabel="Continue"
      primaryDisabled={prefs.school == null}
      onPrimary={next}
      onSkip={() => {
        update({ school: 'unsure' });
        next();
      }}
    >
      {SCHOOLS.map((s, i) => (
        <ChoiceRow key={s.key} last={i === SCHOOLS.length - 1} title={s.name} selected={prefs.school === s.key} onPress={() => update({ school: s.key })} />
      ))}
    </OnboardingFrame>
  );
}
