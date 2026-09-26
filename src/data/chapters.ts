// Chapters are curated full-text searches over the archive. `query` uses
// Postgres websearch syntax (`or` between alternatives), so a chapter matches
// answers that mention any of its key terms.

export interface Chapter {
  id: string;
  name: string;
  arabic: string;
  query: string;
}

export const CHAPTERS: Chapter[] = [
  { id: 'purification', name: 'Purification', arabic: 'الطهارة', query: 'wudu or ghusl or tayammum or najasah or purity' },
  { id: 'prayer', name: 'Prayer', arabic: 'الصلاة', query: 'salah or salat or namaz or prayer' },
  { id: 'fasting', name: 'Fasting', arabic: 'الصوم', query: 'fasting or fast or ramadan or sawm' },
  { id: 'zakah', name: 'Zakāh', arabic: 'الزكاة', query: 'zakat or zakah or sadaqah' },
  { id: 'hajj', name: 'Ḥajj', arabic: 'الحج', query: 'hajj or umrah or ihram' },
  { id: 'family', name: 'Family', arabic: 'النكاح', query: 'nikah or marriage or divorce or talaq' },
  { id: 'finance', name: 'Finance', arabic: 'المعاملات', query: 'riba or interest or loan or business or trade' },
  { id: 'food', name: 'Food & drink', arabic: 'الأطعمة', query: 'halal meat or slaughter or alcohol or food' },
  { id: 'dress', name: 'Dress', arabic: 'اللباس', query: 'hijab or clothing or beard or dress' },
  { id: 'travel', name: 'Travel', arabic: 'السفر', query: 'travel or traveller or musafir or qasr' },
  { id: 'medical', name: 'Medicine', arabic: 'الطب', query: 'medicine or medical or surgery or treatment' },
  { id: 'belief', name: 'Belief', arabic: 'العقيدة', query: 'aqeedah or aqidah or belief or iman' },
  { id: 'death', name: 'Death & inheritance', arabic: 'الجنائز', query: 'janazah or funeral or inheritance or will' },
];

export function chapterById(id: string | undefined): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}
