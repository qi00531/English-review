import { format, parseISO, subDays } from 'date-fns';
import type { LocalDate } from './models';

export function calculateLearningStreak(dates: LocalDate[], today: LocalDate): number {
  const unique = [...new Set(dates.filter((date) => date <= today))].sort().reverse();
  if (unique.length === 0) return 0;

  let expected = unique[0];
  let streak = 0;
  for (const date of unique) {
    if (date !== expected) break;
    streak += 1;
    expected = format(subDays(parseISO(date), 1), 'yyyy-MM-dd') as LocalDate;
  }
  return streak;
}
