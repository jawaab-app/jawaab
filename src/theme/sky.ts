// The sky: a soft wash behind the greeting that follows the time of day.
// This is the one place the app uses colour as atmosphere.

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function timeOfDay(d = new Date()): TimeOfDay {
  const h = d.getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

export const GREETING: Record<TimeOfDay, { en: string; ar: string }> = {
  morning: { en: 'Good morning.', ar: 'صباح الخير' },
  afternoon: { en: 'Good afternoon.', ar: 'طاب يومك' },
  evening: { en: 'Good evening.', ar: 'مساء الخير' },
  night: { en: 'Good night.', ar: 'تصبح على خير' },
};

// Top-to-bottom stops, ending transparent so it dissolves into the paper.
export const SKY: Record<TimeOfDay, { light: [string, string, string]; dark: [string, string, string] }> = {
  morning: { light: ['#FBE6CF', '#FDF3E8', '#FFFFFF00'], dark: ['#2A1F14', '#15110C', '#00000000'] },
  afternoon: { light: ['#D9ECF3', '#EDF6F9', '#FFFFFF00'], dark: ['#0F2028', '#0A1418', '#00000000'] },
  evening: { light: ['#E8D6EE', '#F6E6E1', '#FFFFFF00'], dark: ['#231A2E', '#16101C', '#00000000'] },
  night: { light: ['#D6DCEC', '#EBEEF6', '#FFFFFF00'], dark: ['#0E1530', '#090D1C', '#00000000'] },
};
