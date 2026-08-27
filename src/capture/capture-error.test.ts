import { describe, expect, it } from 'vitest';
import { toSafeCaptureError } from './capture-error';

describe('toSafeCaptureError', () => {
  it.each([
    [401, 'AUTH_FAILED', 'AI 服务认证失败，请检查 API Key'],
    [429, 'RATE_LIMITED', '请求过于频繁，请稍后重试'],
    [404, 'MODEL_UNAVAILABLE', '当前模型不可用，请检查模型名称'],
  ] as const)('maps HTTP %s without exposing provider details', (status, code, message) => {
    const result = toSafeCaptureError({ status, message: 'Bearer sk-secret provider body' }, 'enrich');
    expect(result).toMatchObject({ code, message, status, stage: 'enrich' });
    expect(result.detail).toContain(code);
    expect(JSON.stringify(result)).not.toContain('sk-secret');
    expect(JSON.stringify(result)).not.toContain('Bearer');
  });

  it('maps network and storage failures to actionable messages', () => {
    expect(toSafeCaptureError(new TypeError('Failed to fetch sk-secret'), 'preview')).toMatchObject({
      code: 'NETWORK', message: '网络连接失败，请检查连接后重试',
    });
    expect(toSafeCaptureError({ name: 'DatabaseClosedError' }, 'save')).toMatchObject({
      code: 'STORAGE_FAILED', message: '本地保存失败，请重试',
    });
  });
});
