// SmartBishkek design tokens — mirrors design/tokens.jsx
export const C = {
  navy900: '#0F1F33',
  navy800: '#162C45',
  navy700: '#1F3B5B',
  navy600: '#2C4F75',
  navy500: '#3D6491',
  navy400: '#6B8AB0',
  navy300: '#9DB3CE',
  navy200: '#CDD9E6',
  navy100: '#E6ECF3',
  navy50:  '#F4F7FA',

  amber900: '#7A4D08',
  amber700: '#B8740F',
  amber500: '#F39C12',
  amber400: '#F6B147',
  amber300: '#FACE85',
  amber200: '#FCE3B7',
  amber100: '#FEF2DD',
  amber50:  '#FFF8EC',

  success700: '#1F7A4A',
  success500: '#2EA86A',
  success100: '#DDF1E5',
  danger700: '#A82626',
  danger500: '#D63838',
  danger100: '#FBE0E0',
  info700: '#1968B5',
  info500: '#2E8AE0',
  info100: '#DEEDFA',
  purple700: '#5A2D8C',
  purple500: '#7A40B8',
  purple100: '#EFE5F8',
};

export const STATUS_TOKENS: Record<string, { bg: string; fg: string; dot: string; label: string }> = {
  pending:     { bg: C.amber100,   fg: C.amber700,  dot: C.amber500,  label: 'Новая' },
  accepted:    { bg: C.info100,    fg: C.info700,   dot: C.info500,   label: 'Принята' },
  in_progress: { bg: C.purple100,  fg: C.purple700, dot: C.purple500, label: 'В работе' },
  resolved:    { bg: C.success100, fg: C.success700,dot: C.success500,label: 'Решена' },
  rejected:    { bg: C.danger100,  fg: C.danger700, dot: C.danger500, label: 'Отклонена' },
};

export const CATEGORY_TOKENS: Record<string, { ru: string; hue: string }> = {
  pothole:  { ru: 'Яма на дороге', hue: C.danger500 },
  garbage:  { ru: 'Мусор',         hue: C.success500 },
  lighting: { ru: 'Освещение',     hue: C.amber500 },
  other:    { ru: 'Другое',        hue: '#5A6273' },
};
