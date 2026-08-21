# Word Journal

一个专注于每日英语输入与艾宾浩斯节奏复习的本地优先网页应用。每天保存的内容形成一个 List，并在 D+1、D+2、D+4、D+7、D+15、D+30 到期；当天到期内容完成前不能录入新词。

## 本地运行

需要 Node.js 20+ 与 Corepack。

```bash
corepack pnpm install
cp .env.example .env
corepack pnpm dev
```

网页默认由 Vite 启动，API 服务监听 `8787`。在 `.env` 中配置兼容 OpenAI Chat Completions 的 `AI_BASE_URL`、`AI_API_KEY` 与 `AI_MODEL`。词典无结果时会回退到 AI；音频 URL 不可用时浏览器会尝试语音合成。

## 数据与隐私

- Lists、词条、复习进度和设置保存在当前浏览器的 IndexedDB，不需要账号，也不会自动同步。
- 只有当前请求补全的英文单词或短语会发往词典和 AI 服务；历史记录不会随请求发送。
- 清除站点数据或更换浏览器会丢失记录。建议在“设置”中定期导出 JSON 备份；恢复前应用会先下载当前数据的安全备份。
- API 密钥只由本地服务端读取，不要放入 `VITE_*` 环境变量或提交到仓库。

## 验证

```bash
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm test:e2e
```

首次运行端到端测试若缺少浏览器，可执行 `corepack pnpm exec playwright install chromium`。
