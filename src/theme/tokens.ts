// Design tokens lifted from the Jawāb mockups.
// Signature colour is a deep, desaturated sea green — never system blue.

export interface Colors {
  accent: string;
  accentSoft: string;
  paper: string;
  card: string;
  ink: string;
  ink2: string;
  ink3: string;
  hair: string;
  field: string;
  pill: string;
  pillShadow: string;
  aya: string;
}

export type Scheme = 'light' | 'dark';

export const palette: Record<Scheme, Colors> = {
  light: {
    accent: '#0F7355',
    accentSoft: 'rgba(15,115,85,0.10)',
    paper: '#FDFDFB',
    card: '#FFFFFF',
    ink: '#1D1D1F',
    ink2: '#6E6E73',
    ink3: '#96969B',
    hair: 'rgba(0,0,0,0.10)',
    field: 'rgba(118,118,128,0.12)',
    pill: 'rgba(255,255,255,0.94)',
    pillShadow: '#000000',
    aya: 'rgba(15,115,85,0.06)',
  },
  dark: {
    accent: '#5FCFAB',
    accentSoft: 'rgba(95,207,171,0.14)',
    paper: '#0B0B0C',
    card: '#161618',
    ink: '#F5F5F7',
    ink2: '#9A9AA0',
    ink3: '#6E6E73',
    hair: 'rgba(255,255,255,0.12)',
    field: 'rgba(118,118,128,0.24)',
    pill: 'rgba(28,28,30,0.94)',
    pillShadow: '#000000',
    aya: 'rgba(95,207,171,0.08)',
  },
};

export const fonts = {
  display: 'Belleza_400Regular',
  body: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
} as const;

export const type = {
  h1: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36 },
  question: { fontFamily: fonts.display, fontSize: 19, lineHeight: 25 },
  cardTitle: { fontFamily: fonts.display, fontSize: 17, lineHeight: 21 },
  lede: { fontFamily: fonts.display, fontSize: 20, lineHeight: 29 },
  body: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 24 },
  meta: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 18 },
  metaStrong: { fontFamily: fonts.medium, fontSize: 13.5, lineHeight: 18 },
  label: { fontFamily: fonts.semibold, fontSize: 11.5, letterSpacing: 1.2 },
  tab: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 14 },
} as const;

export const space = {
  gutter: 20,
  radius: 14,
  radiusLg: 22,
} as const;
