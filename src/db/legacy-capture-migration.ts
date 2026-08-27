import { toSafeCaptureError, type SafeCaptureError } from '../capture/capture-error';
import type { LocalDate } from '../domain/models';

type MigrationRepository = {
  migrateReadyCaptures(today: LocalDate): Promise<{ migrated: number; listNumber?: number }>;
};

export type LegacyCaptureMigrationResult = {
  migrated: number;
  listNumber?: number;
  error?: SafeCaptureError;
};

export async function migrateLegacyCaptures(
  repository: MigrationRepository,
  today: LocalDate,
): Promise<LegacyCaptureMigrationResult> {
  try {
    return await repository.migrateReadyCaptures(today);
  } catch (reason) {
    return { migrated: 0, error: toSafeCaptureError(reason, 'migration') };
  }
}
