# 依赖升级 / 代码清理 / 历史压缩

本仓自身的维护计划，不是跨仓改动。技术栈与命令口径见 [`../tech-stack.md`](../tech-stack.md)，
提交与推送的边界见 [`../fork-workflow.md`](../fork-workflow.md)。

依赖三批（批 0 / 批 1 / 批 2）已落地；清理与 [`main` 历史压缩](main-history-consolidation.md)在后。

## 批 0：pnpm 11 → 12（已落地 2026-10-13）

| 项               | 内容                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 改了             | `package.json` 的 `packageManager` → `12.10.0`；`pnpm-lock.yaml` 顶部新增 `packageManagerDependencies` 段（lockfileVersion 仍 `9.0`）                             |
| 为什么是 12.10.0 | `pnpm-workspace.yaml` 开了 `minimumReleaseAge`（7 天）：钉到 7 天内发布的 pnpm 版本会报 `ERR_PNPM_NO_MATURE_MATCHING_VERSION` 并回退到全局版本。满 7 天后再往前挪 |

## 批 1：非 major（已落地 2026-10-13，`pnpm updateDeps`）

43 个：MUI 全套 9.3→9.4、`@lingui/*` 6.6→6.9、tiptap 3.30→3.31、`@apollo/client` 4.2→4.3、
react/react-dom 19.2.8→19.3.0、oxlint 1.79→1.87、oxfmt 0.64→0.72、vite 8.2→8.3 等。

## 批 2：major（已落地 2026-10-13）

`react-router-dom` 6→7、`typescript` 6→7、`@types/node` 24→26、`dotenv` 17→18、`vite-plugin-pwa` 1→2。
五项一次装完，`oxlint` / `oxfmt` / `tsgo` / `vite build` 全绿。

## 升级时的硬约束

| 现象                                                                     | 处理                                                                                            |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `pnpm updateDeps` 用 `JSON.stringify(…, null, 2)` 重写 `package.json`    | 缩进从 4 变 2，`oxfmt --check` 立刻红 —— 升级后必须再跑一次 `oxfmt --write`                     |
| 升级后 `vite:react-swc` 报 `failed to invoke plugin`                     | `overrides` 把 `@swc/core` 钉在 1.15.11，跟不上 vite 8.3；升到 1.16.13（满 7 天的最新版）后恢复 |
| 直接依赖的 tiptap 升到 3.31.4，传递的 `@tiptap/react` / `pm` 留在 3.30.2 | `pnpm update --depth 10 "@tiptap/*"` 对齐（`--depth Infinity` 不是合法值）                      |
| 从 `allowBuilds` 删掉 `esbuild` 会 `ERR_PNPM_IGNORED_BUILDS`             | esbuild 是 `tsx` / `@lingui/cli` 的传递依赖，仍需它的 postinstall —— 留着                       |
| 钉版本或升 major 撞上 `minimumReleaseAge`                                | 换成 7 天前发布的版本；报错信息里带每个版本的发布时间                                           |

`terser` 已从 devDependencies 删除（vite 8 默认用 oxc 压缩，本仓不再显式声明它）；
`@vitejs/plugin-legacy` 与 `workbox-build` 仍会带自己的 terser，不影响。

## 代码清理（待做）

死依赖（源码 0 引用，已排除 `src/assets/generated/licenses.ts` 这个自动生成清单）：

| 依赖                         | 判定                                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| `@loadable/component`        | 0 引用，懒加载已有 `react-lazily`                                  |
| `graphql-sock`               | 0 引用                                                             |
| `@redux-devtools/extension`  | 0 引用                                                             |
| `vite-plugin-node-polyfills` | 不在 `vite.config.ts` 的 plugins 里                                |
| `workbox-window`             | 0 引用（PWA 侧只用到 `workbox-build`）                             |
| `eslint`                     | 0 引用；oxlint 的 `jsPlugins` 是否真需要它，删完跑一次 oxlint 确认 |
| `@types/react-beautiful-dnd` | 拖拽是 `@dnd-kit`；`tsconfig.json` 的 `types` 里一起删             |
| `@types/sanitize-html`       | 0 引用（`tsconfig.json` 的 `types` 里一起删）                      |
| `@types/yargs`               | 0 引用                                                             |
| `csstype`                    | 0 引用，但是 MUI 类型的传递依赖 —— 删完要 `tsgo` 确认              |

删之前必须验证：`@emotion/styled` / `@emotion/cache` / `@emotion/react` 是 MUI 的样式引擎，
出现多份实例会静默丢样式。

重复职责，单独立项：

| 项                                                                                        | 目标                                   |
| ----------------------------------------------------------------------------------------- | -------------------------------------- |
| 图片取色四个库（`fast-average-color` / `colorthief` / `node-vibrant` / `@vibrant/color`） | 收敛到一个；先查清各自用在哪条取色路径 |
| `mui-nested-menu` 的 peer 只到 MUI 7，本仓是 MUI 9                                        | 换实现或删（2 处引用）                 |

配置残留：`.oxlintrc.jsonc` 的 `ignorePatterns` 里的 `tools/eslint-plugin-header.cjs` 已不存在；
`package.json` 的 `test` 脚本是占位。

`pnpm peers check` 剩下的三类 unmet（`mui-nested-menu` 要 MUI ≤7、`koration` 要 dayjs 精确 1.11.0、
graphql 17 对 codegen 要的 ^16）升级前就有，不阻断构建，随上面几项一起处理。

## 提交压缩

指 `main` 的历史重写，见 [`main-history-consolidation.md`](main-history-consolidation.md)。

## 每批怎么算做完

```sh
./node_modules/.bin/oxlint src tools
./node_modules/.bin/oxfmt --check .
./node_modules/.bin/tsgo
./node_modules/.bin/vite build
```

依赖批次再补 dev server 冒烟（本机 `build/` 产物加载白屏，页面行为只在 dev server 上验，
见 [`../fork-workflow.md`](../fork-workflow.md#两个会让本地验证失真的坑)）。
