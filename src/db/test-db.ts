import { EnglishReviewDatabase } from './schema';

export function createTestDatabase(): EnglishReviewDatabase {
  return new EnglishReviewDatabase(`english-review-test-${crypto.randomUUID()}`);
}
