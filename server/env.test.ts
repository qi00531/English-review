import { describe, expect, it, vi } from 'vitest';
import { loadLocalEnv } from './env';

describe('loadLocalEnv', () => {
  it('loads the local env file when it exists', () => {
    const load = vi.fn();

    loadLocalEnv('.env', () => true, load);

    expect(load).toHaveBeenCalledWith('.env');
  });

  it('keeps deployment environment variables when no file exists', () => {
    const load = vi.fn();

    loadLocalEnv('.env', () => false, load);

    expect(load).not.toHaveBeenCalled();
  });
});
