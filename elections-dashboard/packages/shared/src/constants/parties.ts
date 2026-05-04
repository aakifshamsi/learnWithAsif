export interface PartyInfo {
  name: string;
  abbr: string;
  alliance: string;
  color: string;
}

export const PARTIES: Record<string, PartyInfo> = {
  BJP:   { name: 'Bharatiya Janata Party',        abbr: 'BJP',   alliance: 'NDA',    color: '#FF6B00' },
  INC:   { name: 'Indian National Congress',       abbr: 'INC',   alliance: 'INDIA',  color: '#19AF42' },
  AAP:   { name: 'Aam Aadmi Party',               abbr: 'AAP',   alliance: 'INDIA',  color: '#0088CE' },
  TMC:   { name: 'All India Trinamool Congress',   abbr: 'TMC',   alliance: 'INDIA',  color: '#00B2A9' },
  SP:    { name: 'Samajwadi Party',                abbr: 'SP',    alliance: 'INDIA',  color: '#FF0000' },
  BSP:   { name: 'Bahujan Samaj Party',            abbr: 'BSP',   alliance: 'Others', color: '#0000FF' },
  NCP:   { name: 'Nationalist Congress Party',     abbr: 'NCP',   alliance: 'INDIA',  color: '#004080' },
  SS:    { name: 'Shiv Sena (UBT)',                abbr: 'SS',    alliance: 'INDIA',  color: '#F97316' },
  JDU:   { name: 'Janata Dal (United)',            abbr: 'JDU',   alliance: 'NDA',    color: '#16A34A' },
  TDP:   { name: 'Telugu Desam Party',             abbr: 'TDP',   alliance: 'NDA',    color: '#FFD700' },
  DMK:   { name: 'Dravida Munnetra Kazhagam',     abbr: 'DMK',   alliance: 'INDIA',  color: '#FF0000' },
  ADMK:  { name: 'All India Anna DMK',             abbr: 'ADMK',  alliance: 'Others', color: '#000080' },
  CPM:   { name: 'Communist Party of India (M)',   abbr: 'CPM',   alliance: 'INDIA',  color: '#CC0000' },
  RJD:   { name: 'Rashtriya Janata Dal',           abbr: 'RJD',   alliance: 'INDIA',  color: '#008000' },
  IND:   { name: 'Independent',                   abbr: 'IND',   alliance: 'Others', color: '#6B7280' },
  NOTA:  { name: 'None of the Above',              abbr: 'NOTA',  alliance: 'Others', color: '#9CA3AF' },
};

export const ALLIANCE_COLORS: Record<string, string> = {
  NDA:    '#FF6B00',
  INDIA:  '#19AF42',
  Others: '#6B7280',
};

export const PARTY_TO_ALLIANCE: Record<string, string> = Object.fromEntries(
  Object.entries(PARTIES).map(([code, info]) => [code, info.alliance])
);
