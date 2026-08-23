import { calculateLearningStreak } from './streak';

describe('calculateLearningStreak', () => {
  it('counts unique consecutive List creation dates from the latest date', () => {
    expect(calculateLearningStreak([
      '2026-08-23', '2026-08-23', '2026-08-22', '2026-08-21', '2026-08-19',
    ], '2026-08-23')).toBe(3);
  });

  it('starts from the nearest past learning date when today has no List', () => {
    expect(calculateLearningStreak([
      '2026-08-21', '2026-08-20', '2026-08-19',
    ], '2026-08-23')).toBe(3);
  });

  it('returns zero when there is no learning history', () => {
    expect(calculateLearningStreak([], '2026-08-23')).toBe(0);
  });
});
