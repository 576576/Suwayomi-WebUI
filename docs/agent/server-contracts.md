# 服务端契约在本仓的落点

服务端（[Suwayomi-next](https://github.com/576576/Suwayomi-next)）动了下面这些面，本仓必须跟着动；
只改一侧的表现是「编译通过、运行时落在不存在的东西上」。

| 服务端改动                                      | 本仓要做的                                                                                                                           | 服务端文档                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| GraphQL 类型 / 字段 / 枚举增删                  | 重跑 `pnpm gql:codegen`（见 [`graphql-codegen.md`](graphql-codegen.md)），再 `pnpm tsc` 看哪里对不上                                 | [graphql.md](https://github.com/576576/Suwayomi-next/blob/main/docs/agent/graphql.md)                                         |
| REST 端点或参数语义                             | 按下面「`chapterIndex` 是 0-based」取值                                                                                              | [rest-api.md](https://github.com/576576/Suwayomi-next/blob/main/docs/agent/rest-api.md)                                       |
| `SettingsType` / `PartialSettingsType` 增删字段 | 重跑 codegen + 设置页增删字段；`autoBackupInclude*` 这组设置名随备份开关集合同步                                                     | [database-settings.md](https://github.com/576576/Suwayomi-next/blob/main/docs/agent/plans/database-settings.md)               |
| 备份协议字段（`PartialBackupFlagsInput` 等）    | 同步 `Backup.types.ts` / `Backup.constants.ts`（分组与文案）/ `Backup.utils.ts`（两个映射）/ `BackupFlagInclusionDialog`（灰化依赖） | [backup-options-alignment.md](https://github.com/576576/Suwayomi-next/blob/main/docs/agent/plans/backup-options-alignment.md) |
| OPDS 路由                                       | 见下面「OPDS 的路径不带尾斜杠」                                                                                                      | [opds-v2.md](https://github.com/576576/Suwayomi-next/blob/main/docs/agent/plans/opds-v2.md)                                   |

## `chapterIndex` 是 0-based

REST v1 的 `chapterIndex`（`manga/{mangaId}/chapter/{chapterIndex}` 系列、
`download/{mangaId}/chapter/{chapterIndex}`）按 **0-based** 解释，与 Mihon 的 `sourceOrder`、
`.tachibk` 备份、服务端 `chapter.source_order` 列同一口径。参考实现 Suwayomi-Server 是 1-based ——
照着它抄取值会整体错一位。

本仓的写法：`chapterIndex = chapters.length - 1 - sourceOrder`；`sourceOrder === 0` 即首章。

## OPDS 的路径不带尾斜杠

带尾斜杠的未匹配路径会落到本仓的 SPA fallback，返回 `200 text/html` 而不是 feed ——
服务端 OPDS 1.2 的 `rel="self"` 写成 `{base}/?{q}` 这种带尾斜杠的形式时，取到的其实是本仓页面。
服务端 OPDS 2.0 起 `rel="self"` 一律写成无尾斜杠的 `/api/opds/v2/<path>?<query>`。

本仓这边不做处理：SPA fallback 的匹配规则改不得（前端路由依赖它），要核对 OPDS 就直接用无尾斜杠的路径。
