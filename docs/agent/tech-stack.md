# 技术栈与工具链

前端是**单页应用**：Vite 构建，产物由 [Suwayomi-next](https://github.com/576576/Suwayomi-next) 服务端托管并自动更新。
所有版本以 `package.json` 为唯一来源，本文不列版本号。

## 运行时与构建

| 项       | 是什么                                                                                                     | 注意                                                                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node     | `engines.node` 是硬要求，`.nvmrc` 是开发用版本                                                             | 版本不足时 pnpm 只警告不阻断；本机与 CI 的 Node 不一致会在构建产物上体现出来                                                                        |
| 包管理器 | pnpm，版本钉在 `packageManager`                                                                            | 仓库开了 `minimumReleaseAge`（`pnpm-workspace.yaml`，7 天）：钉到 7 天内发布的 pnpm 版本会报 `ERR_PNPM_NO_MATURE_MATCHING_VERSION` 并回退到全局版本 |
| 依赖策略 | `saveExact`（不写 `^`）、`allowBuilds` 白名单、`overrides` 钉 `@swc/core`                                  | 新增需要跑构建脚本的依赖要进 `allowBuilds`，否则 install 不执行它的 postinstall                                                                     |
| 锁文件   | `pnpm-lock.yaml` 入库                                                                                      | 换 pnpm 大版本后 lockfile 格式可能变，要整份重生成并单独提交                                                                                        |
| 打包     | Vite，`base` 为相对路径 `./`，产物在 `build/`                                                              | `build/` 每次构建 `emptyOutDir` 清空 —— 不要往里放截图等产物                                                                                        |
| 转译     | `@vitejs/plugin-react-swc`（SWC）+ `@lingui/swc-plugin`                                                    | Lingui 的宏在 SWC 层展开，不走 Babel                                                                                                                |
| 兼容     | `@vitejs/plugin-legacy` 只补 `modernPolyfills`（4 个数组方法 + `object/group-by`）                         | 不是给旧浏览器打全量补丁；用到新的 ES 方法要手动加进这个列表                                                                                        |
| PWA      | `vite-plugin-pwa`，只配运行期图片缓存（章节页 / 缩略图 / 扩展图标 / 其他），manifest 用 `public/` 里现成的 | 4 条 `cacheName` 与 `src/` 里的 `ImageCache.ts` 是成对维护的，改一处要改两处                                                                        |
| 类型检查 | `tsgo`（`@typescript/native-preview`），`pnpm tsc`                                                         | `pnpm tsc:legacy` 是原生 `tsc`，排查类型报错差异时用                                                                                                |

## 前端分层

| 层         | 用什么                                                                                                                                                       | 约束                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| UI         | React + MUI（`material` / `icons-material` / `system` / `utils` / `x-date-pickers`）+ Emotion                                                                | 样式一律 `sx` / `styled`，不用 `style` prop；`@mui/*` 的深层导入被 oxlint 拦         |
| 通知       | notistack                                                                                                                                                    |                                                                                      |
| hooks 工具 | `@mantine/hooks`（MUI 没有的那部分 hooks）                                                                                                                   | 与 MUI 自带的 `useMediaQuery` 不要混用，宽度判断走 `src/base/utils/MediaQuery.tsx`   |
| 服务端数据 | Apollo Client + `graphql-ws`（订阅）+ `apollo-upload-client`（上传）+ `graphql-tag`                                                                          | 类型来自 `src/lib/graphql/generated/`，见 [`graphql-codegen.md`](graphql-codegen.md) |
| 本地状态   | zustand + immer                                                                                                                                              |                                                                                      |
| URL 状态   | `use-query-params`                                                                                                                                           |                                                                                      |
| 路由       | `react-router-dom`                                                                                                                                           | 路由表集中在 `App.tsx` + `AppRoutes`                                                 |
| i18n       | Lingui（`msg` 宏 / `t` / `Trans`）+ Weblate                                                                                                                  | 面向用户的字符串必须可翻译；`.po` 入库，编译出的 `.js` 不入库                        |
| 富文本     | tiptap + mui-tiptap + `@tiptap/markdown`                                                                                                                     |                                                                                      |
| 长列表     | `react-virtuoso`                                                                                                                                             |                                                                                      |
| 拖拽       | `@dnd-kit`                                                                                                                                                   | `use-long-press` 的 `useLongPress` 直接用会被拦，走封装的 `usePress`                 |
| 工具库     | lodash（**只许 `lodash/fp`**）、dayjs、fuse.js、koration、dompurify、marked、jsonrepair、p-limit、file-selector、awaitable-component、polished、stylis(+rtl) | oxlint 的 `no-restricted-imports` 会拦 `lodash` 与 `lodash/*` 的非 fp 路径           |
| 图片取色   | `fast-average-color` / `colorthief` / `node-vibrant` / `@vibrant/color`                                                                                      | 四个库并存，收敛计划见 [`plans/repo-maintenance.md`](plans/repo-maintenance.md)      |
| 测试       | **没有测试**                                                                                                                                                 | `pnpm test` 是占位脚本；oxlint 开了 `no-only-tests` 只为将来准备                     |

## 代码质量

- **oxlint**（`.oxlintrc.jsonc`）：内置 react / unicorn / typescript / import / jsx-a11y，
  另挂 5 个 JS 插件：`lingui`、`no-relative-import-paths`、`unused-imports`、`no-only-tests`、
  `@tony.ganchev/eslint-plugin-header`（每个源文件必须有 MPL license header）。
- **oxfmt**（`.oxfmtrc.json`）：`printWidth 120`、缩进 4 空格、单引号、`trailingComma: all`。
  它会把能放进 120 列的 import / JSX 合并成一行 —— 手写的多行结构提交前会被压平，属预期行为。
- **husky + lint-staged**（提交前）：`oxfmt --write` → `oxlint --fix` → `i18n:extract`（并 `git add` 受影响的 `.po`）
  → **全量** `pnpm tsc`。单次 1–2 分钟，批量 cherry-pick 要按 20+ 分钟估。

## 生成物：改什么之后要重跑什么

| 生成物                             | 命令                                     | 什么时候必须跑                                                      |
| ---------------------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| `src/lib/graphql/generated/`       | `pnpm gql:codegen`                       | 服务端 schema 变了（见 [`graphql-codegen.md`](graphql-codegen.md)） |
| `src/assets/generated/licenses.ts` | `pnpm gen:licenses`（`pnpm setup` 里带） | 依赖增删后                                                          |
| `src/i18n/locales/*.js`            | lingui compile（构建时）                 | 不入库，不要提交                                                    |
| `build/`                           | `pnpm build`                             | 发版 / zip（zip 走 `pnpm build-zip` → `buildZip/`）                 |

## 常用命令

| 命令                                       | 作用                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| `pnpm dev`                                 | 先 `setup` 再起 dev server（API 基址来自 `.env` 的 `VITE_SERVER_URL_DEFAULT`） |
| `pnpm build` / `build-zip`                 | 生产构建 / 打成 zip                                                            |
| `pnpm lint`                                | `oxlint src tools`                                                             |
| `pnpm format` / `format:check`             | oxfmt 写入 / 只检查                                                            |
| `pnpm tsc`                                 | `tsgo` 全量类型检查                                                            |
| `pnpm gql:codegen`                         | 从本 fork server 拉 schema 生成类型，末尾自动 oxfmt                            |
| `pnpm i18n:extract` / `i18n:gen-resources` | 抽取待翻译串 / 生成语言资源清单                                                |
| `pnpm dayjs:gen-locales`                   | 生成 dayjs 语言包列表与导入（新增语言时）                                      |
| `pnpm manga:gen-type-tags`                 | 生成漫画类型标签                                                               |
| `pnpm updateDeps`                          | 只升**非 major** 依赖，改完 `package.json` 直接提交                            |
| `pnpm create*Changelog`                    | 提交日志 / 翻译日志 / 发版日志                                                 |

## CI

`.github/workflows/` 四个 workflow：`build_pull_request`（PR 四步：`pnpm lint` → `pnpm format:check`
→ `pnpm tsc` → `pnpm build`）、`build-alpha`、`release`、`update_i18n_languages`。

**fork 的 PR 要先由维护者批准 workflow 才会跑**（run 结论 `action_required`），本地四条命令全绿不等于 CI 跑过 ——
详见 [`fork-workflow.md`](fork-workflow.md#本地验证与-ci)。
