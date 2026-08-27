import { expect, it, vi } from 'vitest';
import { migrateLegacyCaptures } from './legacy-capture-migration';

it('returns a safe failure and leaves retry control to the next startup', async () => {
  const repository = { migrateReadyCaptures: vi.fn().mockRejectedValue({
    name: 'DatabaseClosedError', message: 'sk-secret must not escape',
  }) };
  const result = await migrateLegacyCaptures(repository, '2026-08-27');

  expect(result).toMatchObject({ migrated: 0, error: { code: 'STORAGE_FAILED', stage: 'migration' } });
  expect(JSON.stringify(result)).not.toContain('sk-secret');
});
