# `main` 历史压缩（大型重构的契机）

把 `main` 从与上游分叉处到现在的一百多个提交，重写成**十来个功能主题提交**。
按 [`repo-maintenance.md`](repo-maintenance.md) 的依赖升级先落地、再压历史的顺序做 —— 依赖批自身会动
`package.json` / `pnpm-lock.yaml`，先定下来，重写时它们就只有最后一次变更进历史。

**不考虑**其它分支与已发版 tag（用户 2026-10-13 明确）：`patch-*` / `sync-*` 分支与 `r3xxx` tag
不在压缩范围内，压完它们指向的旧对象依然存在，只是不再被 `main` 引用。

## 基线

| 项       | 值                                                            |
| -------- | ------------------------------------------------------------- |
| 分叉点   | `git merge-base upstream/master main` = `73ef5148`            |
| 待压提交 | 115 个（含 1 个 merge：`sync-appbar-search` 的合并）          |
| 目标     | 10–12 个主题提交，每个主题一条 Conventional Commit 标题       |
| 重写方式 | `git reset --soft 73ef5148` 后按主题分批 `git add` + `commit` |

**为什么不用 `git rebase -i`**：这批提交是反复改同一批文件写出来的（设置页重构、备份、
i18n 交错推进），rebase 重排会把每个中间态都撞成冲突，而且 reorder 之后每个提交都不再是真实历史。
软重置拿到的是"最终 tree"，按模块拆分不会冲突。

**代价**：拆分后的单个提交不是可独立构建的中间态（例如设置页提交里含路由改动，但主题顺序靠后的
提交才补上文案）。要能逐级构建就得改成分主题 cherry-pick 重组，那是数倍的工时而收益有限 ——
本仓的目标是历史可读 + 主题可 revert，不是 bisect 友好。

## 主题分组

提交数按 `git log --name-only` 的目录聚类估算，落地时以实际 diff 归属为准。

| #   | 主题提交                                  | 涵盖                                                                                                                             | 主要路径                                                                  |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | `feat(brand)`: fork 品牌与链接            | README 指向 fork、public 图标换成 Suwayomi-next 图标、About 页 Links（GitHub Repo / QQ Group）、更新检查与 wiki 链接             | `public/`、`README.md`、`src/features/about`                              |
| 2   | `ci`: workflow 与构建产物                 | `master`→`main`、build_push 更名 build-alpha、移除 node_modules 缓存、actions 升级、stable tag 规则、`version.txt` / `build-zip` | `.github/workflows/`、`tools/scripts/release/`                            |
| 3   | `feat(settings)`: 设置页重构              | 页面增删（WebUI/Server 页删除、Backup→Data & Storage、Advanced 页）、列表顺序、路径占位符、服务端设置子页草稿+保存、调试信息     | `src/features/settings/`、`src/App.tsx`                                   |
| 4   | `feat(backup)`: 备份与存储                | 存储位置行、手动备份另存为、自动备份频率滑块、备份开关对齐、服务端设置名同步                                                     | `src/features/backup/`、`src/lib/graphql/`                                |
| 5   | `feat(search)`: appbar 搜索               | 模糊搜索、自动补全、搜索建议、最近搜索、`ignoreFilters`（原 17 个提交，已 merge 进来）                                           | `src/features/navigation-bar/`、`src/features/library/`                   |
| 6   | `feat(tracker)`: 进度记录                 | 站点 OAuth 凭据可改、授权页跳转方式（含一次 revert）、刷新用户设置、评分档判定                                                   | `src/features/tracker/`                                                   |
| 7   | `feat(sources)`: 本地图源与扩展商店       | 本地图源文件夹图标、`其他` 语言显示、扩展商店 URL 与条目计数、卸载确认对话框、browse 入口子菜单                                  | `src/features/source/`、`src/features/browse/`、`src/features/migration/` |
| 8   | `feat(manga)`: 漫画详情描述               | Description 行与 altTitles 回退链（含一次加一次删）                                                                              | `src/features/manga/`、`src/features/metadata/`                           |
| 9   | `i18n`: 文案与语言                        | zh-Hans/Hant 补齐、编译产物 `.js` 转 gitignore、区域码到 catalog 的映射                                                          | `src/i18n/`、`.gitignore`                                                 |
| 10  | `feat(graphql)`: codegen 对齐 fork server | schema 来源改本仓 server、注释口径、`chapterIndex` 0-based 跟进服务端                                                            | `src/lib/graphql/`、`src/features/reader/`、`src/features/chapter/`       |
| 11  | `fix`: 下载、更新、图片缓存等杂项         | 下载队列轮询与逐章状态、更新状态刷新、ImageCache 缺 CacheStorage 时的兜底                                                        | `src/features/downloads/`、`src/features/app-updates/`、`src/lib/`        |
| 12  | `docs`: agent 文档                        | fork 约定、codegen 来源、服务端契约、维护计划                                                                                    | `docs/agent/`                                                             |

## 顺带在这一轮处理的东西

历史重写会让所有文件都重新进一次 diff，正好是清掉这几类的时机：

| 项                                                                              | 处理                                                                                                                                     |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 自建滚动容器（`#appMainContainer` 承载全局滚动、scrollbar gutter 补偿）         | 上游 reviewer 已明确否决同类做法（见 [`../fork-workflow.md`](../fork-workflow.md#上游-reviewer-的既有立场)），压缩时一并回到文档原生滚动 |
| 反复改过又丢弃的中间产物（加了又删的 Description 行、revert 掉的 tracker 跳转） | 直接不进新历史                                                                                                                           |
| 死依赖与重复库                                                                  | 见 [`repo-maintenance.md`](repo-maintenance.md#代码清理)                                                                                 |

## 风险与回退

| 风险                                                          | 应对                                                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `main` 已 push，重写后要 `git push --force`                   | 压之前 `git branch backup/main-pre-consolidation` 留一条退路；压完确认无误再删              |
| `build-alpha` / `release` 两个 workflow 挂在 `main` 与 tag 上 | 强推会让后续 run 基于新历史；`versionToServerVersionMapping.json` 的 `PREVIEW` 映射不受影响 |
| 正在进行的 PR 分支以旧 `main` 为 base                         | 与本次无关（PR 分支不压缩），但它们的 base 会变成已消失的对象 —— 需要 rebase 才好看 diff    |

## 怎么算做完

```sh
git rev-list --count 73ef5148..main        # 10–12
git log --oneline 73ef5148..main           # 每个标题能说清一个功能
./node_modules/.bin/oxlint src tools
./node_modules/.bin/oxfmt --check .
./node_modules/.bin/tsgo
./node_modules/.bin/vite build
```

压完的 tree 必须与压缩前**完全一致**（`git diff` 为空），只变历史形状 —— 用
`git diff <backup 分支> main` 核对，非空就是拆错了文件。
