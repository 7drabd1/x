const arabicNumbers = new Intl.NumberFormat('ar-EG');

/** 1234 → ١٬٢٣٤ */
export const fmt = (n: number) => arabicNumbers.format(n);
