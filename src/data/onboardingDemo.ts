// Sample content for the onboarding demos. Layout only, replace with real records.

import type { SchoolKey } from '@/store/prefs';

export const TRACE_ANSWER = {
  question: 'Can I shorten the prayer while travelling?',
  answer: 'Yes. Once the journey meets the distance your school requires, the four-rakʿah prayers are prayed as two.',
  publisher: 'SeekersGuidance',
  scholar: 'Fiqh Team',
  school: 'Mālikī',
  published: '12 March 2019',
  source: 'seekersguidance.org',
};

export interface DemoAnswer {
  school: Exclude<SchoolKey, 'unsure'>;
  schoolName: string;
  question: string;
  publisher: string;
}

// One answer per school, so ranking by school has something to reorder.
export const SCHOOL_DEMO: DemoAnswer[] = [
  { school: 'hanafi', schoolName: 'Ḥanafī', question: 'Is wuḍūʾ valid with nail polish on?', publisher: 'Darul Iftaa' },
  { school: 'maliki', schoolName: 'Mālikī', question: 'How is the travel distance measured?', publisher: 'SeekersGuidance' },
  { school: 'shafii', schoolName: 'Shāfiʿī', question: 'Must I fast while travelling in Ramaḍān?', publisher: 'SeekersGuidance' },
  { school: 'hanbali', schoolName: 'Ḥanbalī', question: 'Can I combine prayers because of work?', publisher: 'IslamQA' },
];

// Topic chips map to chapters on the home rail. Missing keys have no chapter yet.
export const TOPIC_TO_CHAPTER: Record<string, string> = {
  purification: 'purification',
  prayer: 'prayer',
  fasting: 'fasting',
  zakah: 'zakah',
  family: 'family',
  finance: 'finance',
};
