import type { LanguageKey, SchoolKey } from '@/store/prefs';

export const SCHOOLS: { key: SchoolKey; name: string; arabic: string; note: string }[] = [
  { key: 'hanafi', name: 'Ḥanafī', arabic: 'الحنفية', note: 'South Asia, Turkey, Central Asia, the Balkans' },
  { key: 'maliki', name: 'Mālikī', arabic: 'المالكية', note: 'North and West Africa, the Gulf coast' },
  { key: 'shafii', name: 'Shāfiʿī', arabic: 'الشافعية', note: 'East Africa, Egypt, Yemen, Southeast Asia' },
  { key: 'hanbali', name: 'Ḥanbalī', arabic: 'الحنابلة', note: 'Saudi Arabia, Qatar' },
  { key: 'unsure', name: 'Not sure yet', arabic: '', note: 'Show me answers from every school' },
];

export const LANGUAGES: { key: LanguageKey; name: string; native: string }[] = [
  { key: 'en', name: 'English', native: 'English' },
  { key: 'ar', name: 'Arabic', native: 'العربية' },
  { key: 'ur', name: 'Urdu', native: 'اردو' },
  { key: 'tr', name: 'Turkish', native: 'Türkçe' },
  { key: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { key: 'fr', name: 'French', native: 'Français' },
];

export const TOPICS: { key: string; name: string; arabic: string }[] = [
  { key: 'purification', name: 'Purification', arabic: 'الطهارة' },
  { key: 'prayer', name: 'Prayer', arabic: 'الصلاة' },
  { key: 'fasting', name: 'Fasting', arabic: 'الصوم' },
  { key: 'zakah', name: 'Zakāh', arabic: 'الزكاة' },
  { key: 'hajj', name: 'Ḥajj', arabic: 'الحج' },
  { key: 'family', name: 'Marriage & family', arabic: 'النكاح' },
  { key: 'finance', name: 'Money & trade', arabic: 'المعاملات' },
  { key: 'food', name: 'Food & drink', arabic: 'الأطعمة' },
  { key: 'dress', name: 'Dress & appearance', arabic: 'اللباس' },
  { key: 'travel', name: 'Travel', arabic: 'السفر' },
  { key: 'medical', name: 'Health & medicine', arabic: 'الطب' },
  { key: 'work', name: 'Work & study', arabic: 'العمل' },
  { key: 'belief', name: 'Belief', arabic: 'العقيدة' },
  { key: 'death', name: 'Death & inheritance', arabic: 'الجنائز' },
];

export const PUBLISHERS: { key: string; name: string; short: string; schools: string; region: string }[] = [
  { key: 'seekersguidance', name: 'SeekersGuidance', short: 'SG', schools: 'Ḥanafī · Shāfiʿī', region: 'Canada' },
  { key: 'darulifta', name: 'Darul Iftaa', short: 'DI', schools: 'Ḥanafī', region: 'South Africa' },
  { key: 'islamqa', name: 'IslamQA', short: 'IQ', schools: 'Ḥanbalī', region: 'Saudi Arabia' },
  { key: 'askimam', name: 'Askimam', short: 'AI', schools: 'Ḥanafī', region: 'South Africa' },
  { key: 'daruliftaa-uk', name: 'Darul Iftaa Leicester', short: 'DL', schools: 'Ḥanafī', region: 'United Kingdom' },
  { key: 'amja', name: 'AMJA', short: 'AM', schools: 'All schools', region: 'United States' },
  { key: 'dar-al-ifta', name: 'Dār al-Iftāʾ al-Miṣriyyah', short: 'DM', schools: 'Shāfiʿī · Ḥanafī', region: 'Egypt' },
  { key: 'lamppost', name: 'Lamppost Education', short: 'LP', schools: 'Mālikī', region: 'United States' },
];
