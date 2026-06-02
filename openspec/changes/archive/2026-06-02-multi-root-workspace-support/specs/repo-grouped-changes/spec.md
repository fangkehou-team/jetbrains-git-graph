# Spec: Commit 面板仓库分组显示

## 概述

当 Commit 面板涉及多个 Git 仓库时，文件列表按仓库分组显示。

## 行为

### 单仓库模式

只涉及一个 git 根时，保持原有显示方式：
- Changes / Staged / Unversioned 直接显示文件或目录树

### 多仓库模式

涉及多个 git 根时，每个 FileGroup（Changes/Staged/Unversioned）内部按仓库分组：

```
CHANGES 5 FILES
  Grapcode
    grapcode-core (2 files)
    grapcode-server/internal/api/rest (1 file)

STAGED 12 FILES
  AutoClone-njs
    src (11 files)
    package.json
```

### 实现

- `CommitTab` 顶层计算 `allRepoRoots`（所有 changes 中唯一的 `workspaceRoot`）
- 当 `allRepoRoots.size > 1` 时，向每个 `FileGroup` 传递 `forceShowRepo={true}`
- `RepoAwareFileList` 在 `forceShowRepo` 为 true 时，即使只有一个 repo 也显示 repo 头部
