/**
 * Everything specific to the person this site is dedicated to lives here.
 * The vocalised forms are used inside the duas (adhkar.ts) so the Arabic grammar stays correct.
 */
export const MEMORIAL = {
  name: 'سليم بن علي الحمداني',
  banner: 'صدقة جارية عن المرحوم بإذن الله',
  prayer: 'اللهم اغفر له وارحمه وعافه واعف عنه',
  /** after «إنَّ» (accusative) */
  fullAccusative: 'سَلِيمَ بْنَ عَلِيٍّ',
  /** after «لِـ» (genitive) */
  fullGenitive: 'سَلِيمِ بْنِ عَلِيٍّ',
} as const;

/** Text appended to anything the visitor copies or shares. */
export const MEMORIAL_SIGNATURE = `${MEMORIAL.banner}: ${MEMORIAL.name}`;
