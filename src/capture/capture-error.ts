export type SafeCaptureError = {
  code: 'NETWORK' | 'AUTH_FAILED' | 'RATE_LIMITED' | 'MODEL_UNAVAILABLE'
    | 'INVALID_CONTENT' | 'INVALID_RESPONSE' | 'STORAGE_FAILED' | 'UNEXPECTED';
  message: string;
  stage: 'preview' | 'enrich' | 'save' | 'migration';
  status?: number;
  detail: string;
};

type ErrorShape = { status?: unknown; code?: unknown; name?: unknown };

export function toSafeCaptureError(
  reason: unknown,
  stage: SafeCaptureError['stage'],
): SafeCaptureError {
  const shape = reason && typeof reason === 'object' ? reason as ErrorShape : {};
  const status = typeof shape.status === 'number' ? shape.status : undefined;
  let code: SafeCaptureError['code'] = 'UNEXPECTED';
  let message = '服务暂时异常，请稍后重试';

  if (reason instanceof TypeError) {
    code = 'NETWORK'; message = '网络连接失败，请检查连接后重试';
  } else if (status === 401 || status === 403) {
    code = 'AUTH_FAILED'; message = 'AI 服务认证失败，请检查 API Key';
  } else if (status === 429) {
    code = 'RATE_LIMITED'; message = '请求过于频繁，请稍后重试';
  } else if (status === 404 || shape.code === 'MODEL_UNAVAILABLE') {
    code = 'MODEL_UNAVAILABLE'; message = '当前模型不可用，请检查模型名称';
  } else if (shape.code === 'INVALID_CONTENT' || shape.code === 'NOT_ENGLISH' || shape.code === 'TOO_MANY_WORDS') {
    code = 'INVALID_CONTENT'; message = '内容格式无法识别，请重新选择单词或短语';
  } else if (shape.code === 'INVALID_RESPONSE') {
    code = 'INVALID_RESPONSE'; message = 'AI 返回内容无法解析，请重试';
  } else if (stage === 'save' || shape.name === 'DatabaseClosedError' || shape.name === 'ConstraintError') {
    code = 'STORAGE_FAILED'; message = '本地保存失败，请重试';
  }

  const detail = [`错误类型: ${code}`, `阶段: ${stage}`, status === undefined ? '' : `状态码: ${status}`, `说明: ${message}`]
    .filter(Boolean).join('\n');
  return { code, message, stage, ...(status === undefined ? {} : { status }), detail };
}
