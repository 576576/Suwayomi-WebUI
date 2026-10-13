# 备份选项对齐 Mihon：本仓落点

完整方案在 Suwayomi-next：
https://github.com/576576/Suwayomi-next/blob/main/docs/agent/plans/backup-options-alignment.md
（proto 105/106 的取舍、10 个 flag 的语义、恢复侧 `in_library` 跟随 `favorite`、服务端与沙盒各层的改动。）
本文只留本仓这一侧。

## 本仓已有机制

- `BACKUP_FLAGS_BY_GROUP`（`src/features/backup/Backup.constants.ts`）—— 按组划分的开关清单，
  组名走 `BACKUP_FLAG_GROUP_TO_TRANSLATION` 的 `msg` 描述符；
- `BackupFlagInclusionDialog`（`src/features/backup/component/`）—— 勾选对话框，带 `hiddenFlags` prop；
- `src/features/backup/Backup.utils.ts` 的 `convertToAutoBackupFlags` / `convertToBackupFlags`
  —— 手动备份的 flag 与 `autoBackupInclude*` 服务端设置之间的两个映射。

## 落地情况（2026-09-30）

- 10 个复选框 + 灰化依赖 + 「创建」按钮的内容判定（`hasBackupContent`）；
- 改了 `Backup.types.ts` / `Backup.constants.ts`（文案、分组）/ `Backup.utils.ts`（两个映射）/
  `BackupFlagInclusionDialog`（灰化依赖）；
- generated 4 个文件重生成（见 [`../graphql-codegen.md`](../graphql-codegen.md)）；
- `zh-Hans` / `zh-Hant` 文案补齐。

怎么算做完：勾选对话框里 10 个开关齐备、全不选时「创建」禁用、勾选真的改变导出产物的字节、
导出 URL 带上 10 个开关；取消恢复对话框不产生 unhandled rejection。

## 服务端设置名同步

`autoBackupIncludeClientData` + `autoBackupIncludeServerSettings` → `autoBackupIncludeAppSettings`
（再加 4 项），按最终 10 项的集合改名/增删。设置名会进 GraphQL 与本仓的设置页，不跟着改的话
手动备份与自动备份两侧的开关集合会长期不一致。
