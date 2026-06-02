# Spec: 多仓库操作路由

## 概述

所有 Git 操作需要按仓库路由到正确的 GitService 实例。

## 后端路由

`extension.ts` 中所有 handler 通过 `getGitService(workspaceRoot?: string)` 查找：
- 传入 `workspaceRoot` → 从 `gitServices` Map 中精确查找
- 未传入 → 回退到默认服务（兼容单仓库）

## 涉及的 Handler

| Handler | workspaceRoot 参数 |
|---------|-------------------|
| getGraphData | ✓ |
| getBranches | ✓ |
| getTags | ✓ |
| getCommitFiles | ✓ |
| getLog / loadMoreLog | ✓ |
| getWorkingTreeChanges | 聚合所有仓库 |
| stageFile / unstageFile | ✓ |
| stageAll / unstageAll | ✓ |
| commitChanges / commitAndPush | ✓ |
| rollbackFile | ✓ |
| getShelves / shelveChanges / unshelveChanges / deleteShelve | ✓ |
| getIdeaShelves / ideaShelveChanges / ideaUnshelveChanges / deleteIdeaShelf | ✓ |
| openDiffEditor / showDiffForWorkingFile | ✓ |
| getMergeState / getConflictFiles / getFileVersions / saveMergedContent | ✓ |
| deleteFiles / revealInSystemExplorer | ✓ |

## 前端数据流

每个 `WorkingTreeFile` 携带 `workspaceRoot` 字段，所有操作请求自动携带该字段。
