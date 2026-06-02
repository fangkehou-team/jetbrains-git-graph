## 1. Phase 1 — 后端多仓库基础设施与 Git Graph 面板仓库切换

- [x] 1.1 修改 `src/extension.ts`：将 `gitService` 单例改为 `Map<string, GitService>`，过滤掉非 Git 仓库的 workspace folders
- [x] 1.2 新增 `getRepos` handler，返回所有可用仓库列表（路径、名称、当前分支）
- [x] 1.3 修改 `getGraphData`、`getBranches`、`getTags`、`getCommitFiles` 等 Graph 相关 handler，接收 `workspaceRoot` 参数并路由到对应 GitService
- [x] 1.4 修改 `getLog`、`loadMoreLog` handler，支持 `workspaceRoot` 参数
- [x] 1.5 修改 `webview/src/shared/store/panel-store.ts`：增加 `repos`、`activeRepo` 状态；`fetchInitialData` 请求带 `workspaceRoot`
- [x] 1.6 新增 `GitGraphPanel` 顶部仓库选择器组件（单仓库隐藏、多仓库显示下拉列表）
- [x] 1.7 实现仓库切换时自动加载对应仓库的 graph 数据并恢复该仓库的选中状态
- [x] 1.8 修改状态栏显示逻辑：多仓库时显示 `repo-name (branch-name)`

## 2. Phase 2 — Commit 面板按仓库分组与操作路由

- [x] 2.1 修改 `getWorkingTreeChanges` handler：返回的每个文件增加 `workspaceRoot` 字段标识所属仓库
- [x] 2.2 修改 `stageFile`、`unstageFile`、`stageAll`、`unstageAll`、`rollbackFile` handler，接收 `workspaceRoot` 参数
- [x] 2.3 修改 `commitChanges`、`commitAndPush` handler，接收 `workspaceRoot` 参数
- [x] 2.4 修改 `webview/src/shared/store/commit-store.ts`：`WorkingTreeFile` 增加 `workspaceRoot`；所有操作请求带该字段
- [x] 2.5 实现 commit 时按 `workspaceRoot` 将选中文件分组，分别向多个仓库发送 commit 请求
- [x] 2.6 修改 Commit 面板 UI：所有文件操作携带 `workspaceRoot`，多仓库时操作路由正确
- [x] 2.7 修改 `getShelves`、`shelveChanges`、`unshelveChanges`、`deleteShelve` handler，支持 `workspaceRoot`
- [x] 2.8 修改 IDEA Shelf 相关 handler（`getIdeaShelves`、`ideaShelveChanges` 等），支持 `workspaceRoot`

## 3. Phase 3 — Diff/Merge/冲突/GitWatcher 多仓库支持

- [x] 3.1 修改 `openDiffEditor` handler 和 `DiffEditorManager`，支持 `workspaceRoot` 参数
- [x] 3.2 修改 `showDiffForWorkingFile` handler，URI 中携带 `root` 参数路由到正确仓库
- [x] 3.3 修改冲突相关 handler（`getMergeState`、`getConflictFiles`、`getFileVersions`、`saveMergedContent` 等），支持 `workspaceRoot`
- [x] 3.4 修改 `GitContentProvider`：接受 `Map<string, GitService>`，URI query 中的 `root` 参数路由到对应仓库
- [x] 3.5 修改 `src/watchers/gitWatcher.ts`：为每个仓库创建独立 watcher（已在 Phase 1 完成）
- [x] 3.6 修改 `deleteFiles`、`revealInSystemExplorer` 等文件操作 handler，支持多仓库路径解析
- [x] 3.7 全链路回归测试：单仓库 workspace 行为与之前完全一致
- [x] 3.8 验证多仓库 workspace：两个独立 Git 仓库可以分别查看 graph、commit、stage、查看 diff

## 4. 实现过程中发现的问题与修复

- [x] 4.1 **路径解析问题**：当多个 workspace folder 属于同一个 git 根时，`getWorkingTreeChanges` 返回的 `workspaceRoot` 原先是 workspace folder 路径，导致文件路径被重复拼接（如 `grapcode-core/grapcode-core/...`）。修复：`GitService` 新增 `gitRoot` 属性和 `resolveGitRoot()` 方法，`getWorkingTreeChanges` 返回 `workspaceRoot: this.gitRoot`。
- [x] 4.2 **动态 workspace folder 增删**：添加新目录后需要重新加载窗口才能检测。修复：`activate()` 改为 `async`，初始化时按 git 根去重；添加 `onDidChangeWorkspaceFolders` 事件监听器，支持动态增删 GitService 和 GitWatcher。
- [x] 4.3 **COMMIT 面板多仓库显示混淆**：多仓库时不同仓库的文件混在一起，目录路径显示为相对于 git 根的相对路径。修复：当整个面板涉及多个 repo 时，`CommitTab` 中每个 FileGroup 通过 `RepoAwareFileList` 按 `workspaceRoot` 分组显示，并用 repo 名称包裹内部目录树。
- [x] 4.4 **Add to VCS 在非 git 根目录失效**：当 workspace folder 不是 git 根（而是子目录）时，`GitService` 的 `this.cwd` 是子目录路径，但文件路径是相对于 git 根的，导致 `git add` 找不到文件。修复：`execGit` 的 cwd 从 `this.cwd` 改为 `this.gitRoot`，确保所有 git 命令在真实 git 根下执行。
