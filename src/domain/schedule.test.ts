import { buildReviewDates } from './schedule';

describe('buildReviewDates', () => {
  it('creates six fixed calendar-day review dates', () => {
    expect(buildReviewDates('2026-08-21')).toEqual([
      '2026-08-22',
      '2026-08-23',
      '2026-08-25',
      '2026-08-28',
      '2026-09-05',
      '2026-09-20',
    ]);
  });

  it('handles leap days and year rollover as calendar dates', () => {
    expect(buildReviewDates('2024-02-28')[0]).toBe('2024-02-29');
    expect(buildReviewDates('2026-12-31').slice(0, 2)).toEqual([
      '2027-01-01',
      '2027-01-02',
    ]);
  });
});
