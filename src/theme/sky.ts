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

export const GREETING: Record<TimeOfDay, string> = {
  morning: 'Good morning.',
  afternoon: 'Good afternoon.',
  evening: 'Good evening.',
  night: 'Good night.',
};

export const TIMES: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];

// One picture per time of day, shown as a band behind the greeting.
// Placeholders rendered by script; replace with generated art of the same names.
export const SKY_ART: Record<TimeOfDay, number> = {
  morning: require('../../assets/images/sky/morning.jpg'),
  afternoon: require('../../assets/images/sky/afternoon.jpg'),
  evening: require('../../assets/images/sky/evening.jpg'),
  night: require('../../assets/images/sky/night.jpg'),
};

// Night art is dark, so the greeting flips to light ink on it.
export const SKY_DARK_ART: Record<TimeOfDay, boolean> = { morning: false, afternoon: false, evening: false, night: true };
