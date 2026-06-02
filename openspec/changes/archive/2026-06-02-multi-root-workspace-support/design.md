# 多根工作区支持 — 设计文档

## 架构变更

### 1. GitService 管理

由单例改为按 **git 根去重**的 `Map<string, GitService>`：
- key: `git rev-parse --show-toplevel` 解析的真实 git 根路径
- value: 对应的 `GitService` 实例

`GitService` 新增 `gitRoot` 属性，与 `cwd`（workspace folder 路径）区分：
- `cwd`: 初始化时传入的 workspace folder 路径
- `gitRoot`: 通过 `git rev-parse --show-toplevel` 解析的真实 git 根

所有 git 命令通过 `execGit` 执行时，cwd 使用 `this.gitRoot` 而非 `this.cwd`。

### 2. 动态 Workspace Folder 变更

`activate()` 改为 `async`，支持 `onDidChangeWorkspaceFolders`：
- 新增 workspace folder → 注册对应的 GitService 和 GitWatcher
- 删除 workspace folder → 检查是否仍被其他 folder 引用，若无则清理
- 变更后广播 `gitStateChanged` 和 `commitStateChanged` 事件

### 3. Handler 路由

所有需要操作特定仓库的 handler 接收 `workspaceRoot` 参数：
- 后端通过 `getGitService(workspaceRoot)` 从 `gitServices` Map 中查找
- 前端在请求中携带 `workspaceRoot`（取自 `WorkingTreeFile.workspaceRoot`）

### 4. Git Graph 面板

- 新增 `getRepos` handler 返回所有仓库列表
- 顶部工具栏新增仓库选择器（单仓库时自动隐藏）
- 切换仓库时重新加载 graph 数据并恢复该仓库的选中状态

### 5. Commit 面板

- `getWorkingTreeChanges` 聚合所有仓库的更改
- 每个文件携带 `workspaceRoot` 字段
- 当面板涉及多个 repo 时，Changes/Staged/Unversioned 各分组内按 repo 名称包裹显示
- Stage/Unstage/Commit/Rollback 等操作按 `workspaceRoot` 路由到正确仓库

### 6. Diff / Merge / Content Provider

- `GitContentProvider` 接受 `Map<string, GitService>`，通过 URI query 中的 `root` 参数路由
- `DiffEditorManager` 支持 `workspaceRoot` 参数
- 冲突相关 handler 支持 `workspaceRoot`
