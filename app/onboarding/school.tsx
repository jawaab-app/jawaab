import { useRouter } from 'expo-router';
import { ChoiceRow, OnboardingFrame } from '@/components/onboarding';
import { SCHOOLS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function SchoolScreen() {
  const router = useRouter();
  const { prefs, update } = usePrefs();
  const next = () => router.push('/onboarding/language');

  return (
    <OnboardingFrame
      step={2}
      title="Which school do you follow?"
      subtitle="Answers from your school come first. You can always read the others, and change this later in settings."
      primaryLabel="Continue"
      primaryDisabled={prefs.school == null}
      onPrimary={next}
      onSkip={() => {
        update({ school: 'unsure' });
        next();
      }}
    >
      {SCHOOLS.map((s, i) => (
        <ChoiceRow
          key={s.key}
          last={i === SCHOOLS.length - 1}
          title={s.name}
          detail={s.note}
          trailing={s.arabic || undefined}
          selected={prefs.school === s.key}
          onPress={() => update({ school: s.key })}
        />
      ))}
    </OnboardingFrame>
  );
}
