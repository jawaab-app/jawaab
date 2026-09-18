// Sample content for layout only. Publisher names are real index targets;
// every answer, byline, date and number here was written for the mockup and
// must be replaced with scraped records before this is shown to anyone.

export type School = 'Ḥanafī' | 'Mālikī' | 'Shāfiʿī' | 'Ḥanbalī';

export interface HistoryItem {
  id: string;
  question: string;
  publisher: string;
  school: School;
  when: string;
  live?: boolean; // currently being read — "3 min left"
}

export interface Chapter {
  id: string;
  name: string;
  arabic: string;
  count: number;
}

export interface Answer {
  id: string;
  topic: string;
  school: School;
  question: string;
  publisher: string;
  publisherShort: string;
  team: string;
  published: string;
  readMinutes: number;
  lede: string;
  paragraphs: string[];
  aya?: { arabic: string; english: string; ref: string };
  quote?: { text: string; attribution: string };
  otherAnswers: number;
}

export const TOTAL_ANSWERS = 12400;
export const TOTAL_PUBLISHERS = 8;

export const history: HistoryItem[] = [
  {
    id: 'shorten-prayer-travel',
    question: 'Can I shorten the prayer while travelling?',
    publisher: 'SeekersGuidance',
    school: 'Mālikī',
    when: '3 min left',
    live: true,
  },
  {
    id: 'travel-distance',
    question: 'How is the travel distance measured?',
    publisher: 'SeekersGuidance',
    school: 'Mālikī',
    when: '2h ago',
  },
  {
    id: 'zakah-gold-jewellery',
    question: 'Is zakāh due on gold jewellery worn every day?',
    publisher: 'Darul Iftaa',
    school: 'Ḥanafī',
    when: 'Yesterday',
  },
];

export const trending: HistoryItem[] = [
  {
    id: 'combine-prayers-work',
    question: 'Can I combine prayers because of work?',
    publisher: 'IslamQA',
    school: 'Ḥanbalī',
    when: '1.2k reads',
  },
  {
    id: 'fasting-while-travelling',
    question: 'Must I fast while travelling in Ramaḍān?',
    publisher: 'SeekersGuidance',
    school: 'Shāfiʿī',
    when: '980 reads',
  },
  {
    id: 'wudu-nail-polish',
    question: 'Is wuḍūʾ valid with nail polish on?',
    publisher: 'Darul Iftaa',
    school: 'Ḥanafī',
    when: '640 reads',
  },
];

export const chapters: Chapter[] = [
  { id: 'purification', name: 'Purification', arabic: 'الطهارة', count: 98 },
  { id: 'prayer', name: 'Prayer', arabic: 'الصلاة', count: 128 },
  { id: 'fasting', name: 'Fasting', arabic: 'الصوم', count: 72 },
  { id: 'zakah', name: 'Zakāh', arabic: 'الزكاة', count: 110 },
  { id: 'family', name: 'Family', arabic: 'النكاح', count: 86 },
  { id: 'finance', name: 'Finance', arabic: 'المعاملات', count: 64 },
];

export const TOTAL_CHAPTERS = 24;

export const answers: Record<string, Answer> = {
  'shorten-prayer-travel': {
    id: 'shorten-prayer-travel',
    topic: 'Travel',
    school: 'Mālikī',
    question: 'Can I shorten the prayer while travelling?',
    publisher: 'SeekersGuidance',
    publisherShort: 'SG',
    team: 'Fiqh Team',
    published: '12 Mar 2019',
    readMinutes: 4,
    lede: 'Yes. Once you are on a journey that meets the distance required by your school, the four-rakʿah prayers are prayed as two.',
    paragraphs: [
      'The permission comes from the Qurʾān directly. What the schools discuss is not whether you may, but how far you must go first.',
      'You return to praying in full once you re-enter your town, or once you form the intention to stay somewhere for the period your school treats as residence — four days for the Mālikīs and Shāfiʿīs, fifteen for the Ḥanafīs.',
      'If you pray behind a resident imām, you follow the imām and complete four. The concession is yours, not the congregation’s.',
    ],
    aya: {
      arabic: 'وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ',
      english: '“When you travel through the land, there is no blame on you for shortening the prayer.”',
      ref: 'al-Nisāʾ 4:101',
    },
    quote: {
      text: '“I travelled with the Prophet ﷺ and he prayed no more than two rakʿahs, and so did Abū Bakr and ʿUmar.”',
      attribution: 'Ibn ʿUmar · al-Bukhārī 1102, Muslim 689',
    },
    otherAnswers: 3,
  },
};

export function getAnswer(id: string): Answer {
  return (
    answers[id] ?? {
      ...answers['shorten-prayer-travel'],
      id,
      question: [...history, ...trending].find((h) => h.id === id)?.question ?? answers['shorten-prayer-travel'].question,
    }
  );
}
