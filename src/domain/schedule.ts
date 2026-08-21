import { addDays, format, parseISO } from 'date-fns';
import { REVIEW_OFFSETS, type LocalDate } from './models';

export function buildReviewDates(createdDate: LocalDate): LocalDate[] {
  const start = parseISO(createdDate);

  return REVIEW_OFFSETS.map(
    (days) => format(addDays(start, days), 'yyyy-MM-dd') as LocalDate,
  );
}
