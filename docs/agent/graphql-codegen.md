# GraphQL generated 类型的 schema 来源

`src/lib/graphql/generated/`（`graphql-base.types.ts` / `graphql.ts` / `apollo-helpers.ts`）由
**Suwayomi-next（本 fork 的 Rust server）** 生成：

```sh
pnpm gql:codegen     # schema 取自 .env 的 CODEGEN_SERVER_URL_GQL
```

`CODEGEN_SERVER_URL_GQL` 默认是 `http://localhost:4567/api/graphql`（Suwayomi-next 的默认端口；
目录与端口的全量口径见其 [`docs/agent/runtime.md`](https://github.com/576576/Suwayomi-next/blob/main/docs/agent/runtime.md)）。

三条约束：

- **必须指向本 fork 的 Rust server**。指错时生成的类型描述的是一个本 fork 不发布的 schema：
  前端能编译通过，请求却落在服务端根本没有的类型/字段上（`MetaType`、`PartialSettingsType`、
  `SettingsDownloadConversion(Header)`、`UpdateState`、`extension(condition: { storeIndexUrl })`
  都属于这一批）。本机实例若不在这个端口上（例如 4567 被占、server 自顺延到了 4568），
  改 `.env` 的 `CODEGEN_SERVER_URL_GQL` 覆盖即可。
- `gql:codegen` 末尾会跑 `oxfmt` 格式化 generated 目录。漏掉这步 `format:check`（PR CI 会执行）
  必红 —— graphql-codegen 自己的缩进/换行跟仓库的 oxfmt 风格不一致。
- 服务端增删类型或字段后必须重新生成，`pnpm tsc` 会立刻指出前端对不上本仓 schema 的位置。

## 与 Suwayomi-next schema 的已知差分

差分逐条记在
[Suwayomi-next 的 GraphQL 基线文档](https://github.com/576576/Suwayomi-next/blob/main/docs/agent/graphql.md)：
未实现的 15 个类型、5 个 `WebUIUpdate*` 里实现了哪一个、本 fork 自有 8 个、几处字段的可空性。

与本仓直接相关的是 **WebUI 自更新那一组**：服务端只提供 `checkForWebUIUpdate`（`WebUIUpdateCheck`
类型），安装侧的 `updateWebUI` / `resetWebUIUpdateStatus` / `getWebUIUpdateStatus` 与订阅
`webUIUpdateStatusChange` 都不提供。本仓对应的 mutation / subscription 因此已删，自更新的安装动作
交给桌面托盘；`CHECK_FOR_WEBUI_UPDATE`（`src/lib/graphql/server/ServerInfoQuery.ts`）保留，
用于提示有新版本可用。
