import { EnglishReviewRepository } from './repository';
import { EnglishReviewDatabase } from './schema';

export const database = new EnglishReviewDatabase();
export const repository = new EnglishReviewRepository(database);
