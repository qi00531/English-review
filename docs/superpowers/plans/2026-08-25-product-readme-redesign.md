# Product README Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal README with a polished product showcase backed by the uploaded homepage screenshot and accurate developer documentation.

**Architecture:** Keep documentation self-contained in `README.md` and store its screenshot under `docs/assets`. Organize the document from product value to real workflow, then developer setup, privacy, architecture, verification, and current boundaries. Validate image paths, commands, environment names, and unsupported-claim exclusions with repeatable shell checks.

**Tech Stack:** GitHub Flavored Markdown, HTML alignment tags, PNG asset, pnpm project scripts

---

### Task 1: Establish failing documentation checks

**Files:**
- Verify: `README.md`
- Verify: `review首页截图.png`
- Verify: `docs/assets/word-journal-home.png`

- [ ] **Step 1: Verify the target asset path is initially missing**

Run:

```bash
test -f docs/assets/word-journal-home.png
```

Expected: FAIL because the uploaded screenshot is still named `review首页截图.png` in the repository root.

- [ ] **Step 2: Verify the product README contract initially fails**

Run:

```bash
rg -n "docs/assets/word-journal-home.png|D\+1.*D\+2.*D\+4.*D\+7.*D\+15.*D\+30|Local-first|项目结构|当前边界" README.md
```

Expected: no complete match set because the current README lacks the hero image, product labels, architecture map, and current-boundaries section.

### Task 2: Move the uploaded homepage screenshot into documentation assets

**Files:**
- Create: `docs/assets/word-journal-home.png`
- Remove: `review首页截图.png`

- [ ] **Step 1: Create the documentation asset directory and move the PNG**

Run:

```bash
mkdir -p docs/assets
mv 'review首页截图.png' docs/assets/word-journal-home.png
```

- [ ] **Step 2: Verify asset identity and dimensions**

Run:

```bash
file docs/assets/word-journal-home.png
sha256sum docs/assets/word-journal-home.png
```

Expected: PNG image data, 2240×1146, with SHA-256 `facb27041416d0f1dd9e66985dca108fc4502fc48ffef2501fe8eb4ac80d79ee`.

### Task 3: Replace README with the product showcase

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write the new README**

Replace `README.md` with a GitHub-compatible document containing this exact information architecture and copy:

```markdown
<div align="center">

# Word Journal

**本地优先的英语输入与间隔复习手账**

把每天学到的单词和短语整理成 List，让它们在合适的时间重新出现。

`Local-first` · `Spaced repetition` · `AI enrichment` · `React + TypeScript`

</div>

![Word Journal 首页：纸张手账上的今日进度、记录入口与连续学习状态](docs/assets/word-journal-home.png)

## 让复习成为每天清晰的一件事

Word Journal 用每日 List 收拢零散的英语输入，并按照固定间隔安排复习。你只需要输入英文，应用会补全中文义项、音标和一句常见义项例句；保存前仍可检查和编辑。

当天到期的内容会集中出现在首页。完成全部到期 List 后，才能继续记录当天的新内容，让学习节奏保持明确而不过载。

## 使用流程

1. **记录**：输入今天学到的英语单词或短语。
2. **补全**：词典提供音标和可用音频，AI 生成中文义项及一组双语例句。
3. **成组**：当天内容保存为一个 List，并自动生成后续复习节点。
4. **复习**：完成今日到期 List，历史页仍可随时手动重练。

## 核心体验

- **每日 List**：同一天输入的内容形成一组，保留清晰的学习上下文。
- **复习门控**：当天到期内容未全部完成前，不开放新内容录入。
- **内容补全**：只输入英文即可生成中文义项和一句常见义项例句，保存前可以编辑。
- **双复习模式**：单词模式聚焦当前词，表格模式快速浏览整组内容。
- **三种显示方式**：完整、只看英文、只看中文，适配不同回忆阶段。
- **发音控制**：单词模式自动循环当前词；表格模式由用户手动播放或停止当前 List 循环。
- **历史与计划**：按日期查看应复习的 Lists，也可以进入任意历史 List 再练一次。
- **本地备份**：支持 JSON 导入导出；恢复数据前会先下载当前数据的安全备份。

## 复习节奏

```text
D+1 → D+2 → D+4 → D+7 → D+15 → D+30
```

每个 List 都会生成六个复习节点。同一天到期的多个 Lists 会共同组成当天任务。

## 快速开始

需要 Node.js 20+ 与 Corepack。

```bash
corepack pnpm install
cp .env.example .env
corepack pnpm dev
```

`pnpm dev` 会同时启动 Vite 前端与本地 Hono API。API 默认监听 `8787` 端口。

## AI 配置

在 `.env` 中配置：

```dotenv
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=your_api_key
AI_MODEL=gpt-4.1-mini
PORT=8787
```

`AI_BASE_URL` 需要兼容 OpenAI Chat Completions 接口。当前词典查询固定使用 dictionaryapi.dev；当词典没有音频时，浏览器会尝试语音合成。`.env.example` 中的 `DICTIONARY_BASE_URL` 目前尚未接入运行时配置。

API Key 只由本地服务端读取。不要使用 `VITE_*` 变量保存密钥，也不要提交 `.env`。

## 数据与隐私

- Lists、词条、复习节点和设置保存在当前浏览器的 IndexedDB。
- 应用不要求账号，也不会默认同步到云端。
- 只有当前需要补全的英文会发送给词典与 AI 服务，历史词库不会整体上传。
- 清除站点数据或更换浏览器会导致本地记录不可用，请定期从“设置”导出 JSON。
- 导入备份会替换当前数据；执行前应用会先下载一份当前数据的安全备份。

## 技术架构

- **Web**：React 19、TypeScript、React Router、Vite
- **Local API**：Hono、Zod、OpenAI-compatible Chat Completions
- **Data**：Dexie、IndexedDB、date-fns
- **Audio**：远程词典音频 + Web Speech API 回退
- **Quality**：Vitest、Testing Library、Playwright

## 项目结构

```text
src/app/           路由与应用入口
src/features/      今日、录入、复习、历史与设置页面
src/domain/        复习计划、日期、连续学习与业务规则
src/db/            IndexedDB 仓库、迁移和备份
src/audio/         发音选择、循环播放与语音合成回退
src/ui/            应用壳层、基础交互和主题样式
server/            本地 Hono API、词典与 AI 内容补全
tests/e2e/         Playwright 端到端流程
public/assets/     网页背景等运行时静态资源
docs/assets/       README 与项目文档图片
```

## 测试与构建

```bash
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm test:e2e
```

首次运行端到端测试若缺少 Chromium：

```bash
corepack pnpm exec playwright install chromium
```

## 当前边界

- 当前版本面向本地桌面浏览器。
- 暂无账号体系、云同步和跨设备数据合并。
- 当前不是浏览器扩展或移动端应用。
- 发音效果取决于词典音频可用性与浏览器语音能力。

---

<div align="center">
  <sub>把今天学到的内容，留给未来恰好的自己。</sub>
</div>
```

- [ ] **Step 2: Check the README for unsupported claims and secrets**

Run:

```bash
rg -n "在线演示|下载量|云同步已上线|MIT License|sk-[A-Za-z0-9]" README.md
```

Expected: no matches.

### Task 4: Validate rendering references and project accuracy

**Files:**
- Verify: `README.md`
- Verify: `docs/assets/word-journal-home.png`
- Verify: `package.json`
- Verify: `.env.example`

- [ ] **Step 1: Validate the screenshot reference**

Run:

```bash
test -f "$(dirname README.md)/docs/assets/word-journal-home.png"
```

Expected: exit code 0.

- [ ] **Step 2: Validate README commands against package scripts**

Run:

```bash
node -e "const p=require('./package.json'); for (const name of ['dev','test','typecheck','build','test:e2e']) if (!p.scripts[name]) process.exit(1)"
```

Expected: exit code 0.

- [ ] **Step 3: Validate required sections and review interval**

Run:

```bash
rg -n "^## (使用流程|核心体验|复习节奏|快速开始|AI 配置|数据与隐私|技术架构|项目结构|测试与构建|当前边界)$" README.md
rg -n "D\+1 → D\+2 → D\+4 → D\+7 → D\+15 → D\+30" README.md
```

Expected: all ten sections and the exact review interval are present.

- [ ] **Step 4: Review the final diff and commit**

Run:

```bash
git diff --check
git diff -- README.md
git status --short
```

Expected: only the README, the moved screenshot, and plan/spec documentation are in scope; no `.env` or generated `dist` files are added.

```bash
git add README.md docs/assets/word-journal-home.png
git commit -m "docs: redesign product readme"
```
