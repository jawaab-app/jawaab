import { useRouter } from 'expo-router';
import { ChoiceRow, OnboardingFrame } from '@/components/onboarding';
import { LANGUAGES } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function LanguageScreen() {
  const router = useRouter();
  const { prefs, update } = usePrefs();
  const next = () => router.push('/onboarding/topics');

  return (
    <OnboardingFrame
      step={3}
      title="Which language do you read in?"
      subtitle="Answers are shown in the language they were written in. Pick the one you want first."
      primaryLabel="Continue"
      onPrimary={next}
      onSkip={next}
    >
      {LANGUAGES.map((l, i) => (
        <ChoiceRow key={l.key} last={i === LANGUAGES.length - 1} title={l.name} trailing={l.native !== l.name ? l.native : undefined} selected={prefs.language === l.key} onPress={() => update({ language: l.key })} />
      ))}
    </OnboardingFrame>
  );
}
