# agent 文档

给**维护者与 AI** 看的文档：现在是什么样、改的时候要注意什么。

面向用户的说明在根 [`README.md`](../../README.md)（上游那份），不放这里。

| 文件                  | 内容                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `fork-workflow.md`    | 本 fork 与上游的关系：向上游贡献的边界、同步上游的方式、本地验证与 CI 四步、预览与截图产物的落点                                      |
| `graphql-codegen.md`  | `src/lib/graphql/generated/` 的来源约束：schema 必须指向本 fork 的 Rust server、`CODEGEN_SERVER_URL_GQL` 的覆盖方式、末尾必须过 oxfmt |
| `server-contracts.md` | 服务端契约在本仓的落点：REST `chapterIndex` 的 0-based 口径、OPDS 尾斜杠会落到 SPA fallback、设置项与备份字段增删时本仓要同步什么     |

某次跨仓改动在本仓这一侧的落地清单在 [`plans/`](plans/)。

## 跨仓文档

本仓与 Suwayomi-next、Suwayomi-tray、Suwayomi-ext-runtime 是一组独立发版的仓库，各自的维护者文档
在各自仓库里：

| 仓库                             | 文档索引                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Suwayomi-next（Rust server）     | https://github.com/576576/Suwayomi-next/blob/main/docs/agent/README.md        |
| Suwayomi-tray（桌面壳）          | https://github.com/576576/Suwayomi-tray/blob/main/docs/agent/README.md        |
| Suwayomi-ext-runtime（扩展沙盒） | https://github.com/576576/Suwayomi-ext-runtime/blob/main/docs/agent/README.md |

引用对方的文档一律写**远端地址**，不写相对路径：四个仓各自发版，本地目录布局不保证同时在场。

## 维护约定

- **只写「是什么」和「不这么做会怎么错」**。决策过程与试错史留在 commit message / PR 里，不进这里 ——
  文档里出现「此前是…」「当初踩过…」这类叙述，说明该删了。
- 这里是**约定与契约**：改了行为就同步改。一次性调研、审计报告、施工进度记录不进这里。
- 代码里放不下的**理由**写到这里；代码注释只留结论。
