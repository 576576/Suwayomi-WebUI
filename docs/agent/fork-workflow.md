# 本 fork 与上游

上游是 [`Suwayomi/Suwayomi-WebUI`](https://github.com/Suwayomi/Suwayomi-WebUI)（默认分支 `master`），
本 fork 是 `576576/Suwayomi-WebUI`（分支 `main`）。下面几条是给上游提改动、以及把上游改动合进来时的固定做法。

## 往上贡献的边界

- **只做小的功能性修补**，不夹带 fork 自有的页面级大改动（设置页两栏/三栏重构、路由重构、品牌与链接
  替换、CI 改造）。这类改动单独开 PR，不要塞进功能修补里。
- 贡献分支从 `upstream/master` 切 `patch-upstream-<主题>`，cherry-pick 单个小提交。
- **不写解释性注释**（license header 保留）；不把多行结构压成一行。两处例外来自仓库自己的格式化标准，
  无法回避：oxfmt 会把能放进 120 列的 import / JSX 合并；oxlint 的 `arrow-body-style` 要求
  `=> { return X; }` 写成 `=> (X)`。
- cherry-pick 后若冲突集中在 fork 独有的重构文件（`Settings.tsx`、`App.tsx` 的路由），说明那个提交
  已被 fork 改动污染 —— 要重写成最小补丁，不要解完冲突直接提交。

## 上游 reviewer 的既有立场

这些方向上的改动会被要求改回来，提之前先自查：

- **不要替换文档滚动元素、不要做 `scrollbar-gutter` 补偿** —— 原生滚动行为优先；需要侧栏固定就用
  `position: sticky`，不要把滚动容器换掉。
- 优先用仓库既有 helper：宽度判断用 `MediaQuery` 里的 hook 而不是裸 `useMediaQuery('(min-width: …)')`；
  文案用模块级常量 + `msg` 宏 + `t(item.label)`；hooks 一律提到 early return 之前。
- ⚠️ `MediaQuery.useIsMobileWidth()` 是 `down('sm')`（< 600px），**不是**桌面那个 900px 断点 ——
  拿它表达"两栏"会把断点挪错一个档。

## 同步上游

先把上游提交 cherry-pick 到 `sync-<主题>` 分支，验证通过后再合回 `main`：

```sh
git merge --no-ff sync-<主题>
```

不要 ff-merge `sync-*`：`--ff` 会把那一串 cherry-pick 直接接到 `main` 上，`main` 就该只多一个合并提交。

**「落后 N 个提交」按提交对象（hash）算，不按功能**：fork 自己实现的功能与上游同功能的提交是不同的对象，
git 互不相认 —— 所以合 fork 自有的功能分支**不会**减少 behind 计数；要降 behind 必须真的把上游的提交
merge 进来，而那会与 fork 自有的对应实现冲突。

## 本地验证与 CI

CI（`.github/workflows/pr.yml` → `lint.yml` + `build.yml`）四步，本地逐条对应着跑一遍即可：

```sh
./node_modules/.bin/oxlint src tools      # = pnpm lint
./node_modules/.bin/oxfmt --check .       # = pnpm format:check
./node_modules/.bin/tsgo                  # = pnpm tsc
./node_modules/.bin/vite build            # ≈ pnpm build（pnpm build 先跑 pnpm setup）
```

直接调二进制比 `pnpm lint` / `pnpm format:check` 快得多 —— 后者先做 pnpm 依赖状态检查，单次 4-5 分钟且易失败。
只验构建时 `vite build` 约 25 秒。

workflow 的切分与上游不同：上游只有 `build_pull_request.yml`，本 fork 换成 `pr.yml` + 可复用的 `lint.yml` /
`build.yml`（外加 `release.yml` / `clear.yml` / `update_i18n.yml`）。同步上游时不要把旧的合回来。

- pre-commit（husky → lint-staged）会跑 `oxfmt --write` / `oxlint --fix` / **全量** `pnpm tsc` /
  `pnpm i18n:extract`，并把 `.po` 一起 `git add`。单次 1-2 分钟，cherry-pick 十几个提交要按 20+ 分钟估。
- **fork PR 的 workflow 默认要维护者批准才跑**，run 结论是 `action_required`。本地四条命令全绿
  **不等于** CI 已跑过。

### 两个会让本地验证失真的坑

- **`vite build` 的产物在本机加载即白屏**：`assets/ServerSettingsMetadata-*.js` 里
  `d(0).seconds.asWholeMinutes.toISOString()` 抛 `TypeError: undefined is not a function`，root 空。
  同一个提交用 `vite dev` 正常。上游 master 的对应 base 提交同样如此，不是本 fork 引入的 ——
  要验证页面行为就用 dev server。
- **本机 server 比本仓旧时页面会卡在 splash**：`GET_SERVER_SETTINGS` 查的字段（如
  `autoBackupIncludeClientData`）服务端没有 → 查询报错 → `AppInitializer` 不完成。
  验证前先让 server 与本仓同代。

### 预览

`vite dev` 的 API 基址来自 `.env` 的 `VITE_SERVER_URL_DEFAULT`（默认 `http://localhost:4567`），
直连会撞 CORS —— 服务端既不发 CORS 头也不处理预检。做法是起一个反代：`/api` 转给 server（默认 4567），
其余转给 dev server，再把 `VITE_SERVER_URL_DEFAULT` 指向反代 origin。

**截图 / 预览产物不要放 `build/`**：`vite build` 的 `emptyOutDir` 会把它清空。放仓库根下的独立目录
（如 `.preview_shots/`）并加进 `.git/info/exclude`。
