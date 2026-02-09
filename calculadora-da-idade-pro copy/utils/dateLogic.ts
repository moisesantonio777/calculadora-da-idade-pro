
import { DateParts, AgeResult } from '../types';

/**
 * Validates if a set of DD/MM/YYYY strings forms a real date.
 */
export const isValidDate = (parts: DateParts): boolean => {
  const d = parseInt(parts.day);
  const m = parseInt(parts.month);
  const y = parseInt(parts.year);

  if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1 || y > 9999) return false;

  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
};

/**
 * Converts DateParts to a JS Date object.
 */
export const partsToDate = (parts: DateParts): Date => {
  return new Date(parseInt(parts.year), parseInt(parts.month) - 1, parseInt(parts.day));
};

/**
 * Formats a JS Date to DD/MM/YYYY.
 */
export const formatDateString = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

/**
 * Calculates the exact age between two dates.
 */
export const calculatePreciseAge = (birth: Date, target: Date): AgeResult => {
  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  // Adjust days and months
  if (days < 0) {
    months--;
    // Get last day of the previous month
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    targetDateFormatted: formatDateString(target),
    isFuture: target >= birth
  };
};

/**
 * Get the Zodiac sign for a given date.
 */
export const getZodiacSign = (day: number, month: number): string => {
  const signs = [
    { name: 'Capricórnio', start: [12, 22], end: [1, 19] },
    { name: 'Aquário', start: [1, 20], end: [2, 18] },
    { name: 'Peixes', start: [2, 19], end: [3, 20] },
    { name: 'Áries', start: [3, 21], end: [4, 19] },
    { name: 'Touro', start: [4, 20], end: [5, 20] },
    { name: 'Gêmeos', start: [5, 21], end: [6, 20] },
    { name: 'Câncer', start: [6, 21], end: [7, 22] },
    { name: 'Leão', start: [7, 23], end: [8, 22] },
    { name: 'Virgem', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 22] },
    { name: 'Escorpião', start: [10, 23], end: [11, 21] },
    { name: 'Sagitário', start: [11, 22], end: [12, 21] },
  ];

  for (const sign of signs) {
    const [sM, sD] = sign.start;
    const [eM, eD] = sign.end;
    if ((month === sM && day >= sD) || (month === eM && day <= eD)) {
      return sign.name;
    }
  }
  return 'Capricórnio'; // Fallback
};
