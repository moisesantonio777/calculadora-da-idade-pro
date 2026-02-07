
export interface DateParts {
  day: string;
  month: string;
  year: string;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  targetDateFormatted: string;
  isFuture: boolean;
}

export interface ValidationError {
  field?: 'birth' | 'target';
  message: string;
}
