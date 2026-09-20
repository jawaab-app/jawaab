import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ChoiceRow, OnboardingFrame, RankDemo, Stagger } from '@/components/onboarding';
import { SCHOOLS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function SchoolScreen() {
  const router = useRouter();
  const { prefs, update } = usePrefs();
  const next = () => router.push('/onboarding/topics');

  return (
    <OnboardingFrame
      step={2}
      title="Your school"
      hint="Answers from it come first."
      primaryLabel="Continue"
      primaryDisabled={prefs.school == null}
      onPrimary={next}
      onSkip={() => {
        update({ school: 'unsure' });
        next();
      }}
    >
      {SCHOOLS.map((s, i) => (
        <Stagger key={s.key} index={i}>
          <ChoiceRow
            last={i === SCHOOLS.length - 1}
            title={s.name}
            selected={prefs.school === s.key}
            onPress={() => {
              Haptics.selectionAsync();
              update({ school: s.key });
            }}
          />
        </Stagger>
      ))}
      <RankDemo school={prefs.school} />
    </OnboardingFrame>
  );
}
