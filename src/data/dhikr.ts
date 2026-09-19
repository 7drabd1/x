import { MEMORIAL } from './memorial';

export interface Dhikr {
  id: string;
  text: string;
}

/** Phrases offered on the tasbeeh. The first one is the default. */
export const DHIKR_LIST: Dhikr[] = [
  { id: 'for-deceased', text: `اللَّهُمَّ اغْفِرْ لِ${MEMORIAL.fullGenitive} وَارْحَمْهُ` },
  { id: 'subhanallah', text: 'سُبْحَانَ اللَّهِ' },
  { id: 'alhamdulillah', text: 'الْحَمْدُ لِلَّهِ' },
  { id: 'allahu-akbar', text: 'اللَّهُ أَكْبَرُ' },
  { id: 'tahlil', text: 'لَا إِلَهَ إِلَّا اللَّهُ' },
  { id: 'istighfar', text: 'أَسْتَغْفِرُ اللَّهَ' },
  { id: 'salawat', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ' },
  { id: 'hawqala', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ' },
  { id: 'tasbih-azim', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ' },
];

export const DEFAULT_DHIKR_ID = DHIKR_LIST[0].id;

/** 0 means "no limit". */
export const GOALS = [33, 99, 100, 0] as const;
