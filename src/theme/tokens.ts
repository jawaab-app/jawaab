// Design tokens. White canvas, one tight grotesk, hairlines instead of cards,
// black pill buttons. Colour is used as a signal, never as decoration.

export interface Colors {
  paper: string; // canvas
  card: string; // raised surface (sheet, input)
  ink: string;
  ink2: string; // secondary label
  ink3: string; // tertiary label
  hair: string; // separator
  field: string; // soft fill for inputs / icon buttons
  accent: string; // small live signals + links
  accentSoft: string;
  aya: string;
  button: string; // primary button fill
  buttonInk: string; // primary button label
}

export type Scheme = 'light' | 'dark';

export const palette: Record<Scheme, Colors> = {
  light: {
    paper: '#FFFFFF',
    card: '#FFFFFF',
    ink: '#0A0A0A',
    ink2: '#6F6F73',
    ink3: '#A8A8AD',
    hair: 'rgba(0,0,0,0.08)',
    field: '#F4F4F5',
    accent: '#0F7355',
    accentSoft: 'rgba(15,115,85,0.10)',
    aya: '#F7F7F8',
    button: '#0A0A0A',
    buttonInk: '#FFFFFF',
  },
  dark: {
    paper: '#000000',
    card: '#121214',
    ink: '#F5F5F7',
    ink2: '#9A9AA0',
    ink3: '#5E5E64',
    hair: 'rgba(255,255,255,0.10)',
    field: '#1A1A1D',
    accent: '#5FCFAB',
    accentSoft: 'rgba(95,207,171,0.14)',
    aya: '#141416',
    button: '#F5F5F7',
    buttonInk: '#0A0A0A',
  },
};

export const fonts = {
  regular: 'InterTight_400Regular',
  medium: 'InterTight_500Medium',
  semibold: 'InterTight_600SemiBold',
  bold: 'InterTight_700Bold',
  /** @deprecated alias of regular */
  body: 'InterTight_400Regular',
  /** @deprecated alias of semibold */
  display: 'InterTight_600SemiBold',
} as const;

export const type = {
  hero: { fontFamily: fonts.semibold, fontSize: 40, lineHeight: 46, letterSpacing: -1.8 },
  largeTitle: { fontFamily: fonts.semibold, fontSize: 34, lineHeight: 40, letterSpacing: -1.4 },
  h1: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 33, letterSpacing: -1.1 },
  title: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 24, letterSpacing: -0.6 },
  question: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 22, letterSpacing: -0.4 },
  cardTitle: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 20, letterSpacing: -0.4 },
  lede: { fontFamily: fonts.medium, fontSize: 21, lineHeight: 28, letterSpacing: -0.6 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 25, letterSpacing: -0.3 },
  meta: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 17, letterSpacing: -0.1 },
  metaStrong: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 17, letterSpacing: -0.1 },
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
  tab: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 14 },
} as const;

export const space = {
  gutter: 20,
  radius: 14,
  radiusLg: 22,
  pill: 999,
} as const;
