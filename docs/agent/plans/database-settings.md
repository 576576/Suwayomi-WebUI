# 数据库设置接线：本仓落点

完整方案在 Suwayomi-next：
https://github.com/576576/Suwayomi-next/blob/main/docs/agent/plans/database-settings.md
（引导文件的优先级、四个字段逐个的处置、`H2` 为什么从枚举里去掉、服务端的实施分层。）
本文只留本仓这一侧。**这部分尚未落地**（服务端的引导文件与回读已经接线，本仓的设置页还没开）。

## 要做的事

`src/features/settings/screens/ServerSettings.tsx` 的「服务端设置」加一个「数据库」分区。原先没有这一块，
原因写在该文件的注释里（后端由 `SUWAYOMI_DB_BACKEND` 决定、Hikari 是参考实现的东西）—— 接线后这块重开，
但只放四个字段 + 两条只读信息：

- 三个可编辑项：`databaseType`（下拉）/ `databaseUrl` / `databaseUsername` + `databasePassword`；
- `useHikariConnectionPool` **不进界面**（服务端接收但按 no-op 处理，将来要池旋钮另立名字）；
- 只读的「当前生效」：`databaseType` 与 `databaseUrl` 回读的必须是**实际生效**的值（来自 env 或引导文件），
  不是刚存下的草稿；
- 「改完需重启」提示，以及「换后端不会搬运数据」的警示 —— 缺这条，用户会以为切过去就能看到书架。

## 怎么算做完

改完不重启时只读项显示的是旧值，重启后显示新值；`databaseType=POSTGRESQL` 且 URL 为空时不落盘并给出错误；
`databasePassword` 在回读时是打码值。

## codegen

`enum DatabaseType` 已收敛成 `RUSQLITE` / `POSTGRESQL`（本仓 `graphql-base.types.ts` 已同步）。
服务端再动这个枚举或增删这四个字段时要重跑 `pnpm gql:codegen` 并 `pnpm tsc`。
