import { BackupV1Schema } from '../domain/backup-schema';
import { EnglishReviewRepository, type RepositorySnapshot } from './repository';

export async function exportBackup(
  repository: EnglishReviewRepository,
  exportedAt = new Date().toISOString(),
): Promise<string> {
  return JSON.stringify({
    format: 'english-review-backup',
    version: 1,
    exportedAt,
    data: await repository.snapshot(),
  }, null, 2);
}

export async function importBackup(
  repository: EnglishReviewRepository,
  json: string,
  mode: 'replace',
): Promise<void> {
  if (mode !== 'replace') throw new Error('不支持的导入模式');

  try {
    const parsed = BackupV1Schema.parse(JSON.parse(json));
    await repository.replaceSnapshot(parsed.data as RepositorySnapshot);
  } catch (error) {
    if (error instanceof SyntaxError || !(error instanceof Error) || error.name === 'ZodError') {
      throw new Error('备份文件无效或版本不受支持');
    }
    throw error;
  }
}
