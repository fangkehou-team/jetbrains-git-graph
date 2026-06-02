# Spec: Git Graph 面板仓库切换

## 概述

当工作区包含多个 Git 仓库时，Git Graph 面板需要支持仓库切换。

## 接口

### getRepos

返回所有可用 Git 仓库列表。

**Request**: 无参数
**Response**:
```ts
Array<{
  path: string;      // git 根绝对路径
  name: string;      // 目录名
  branch: string;    // 当前分支
}>
```

### 面板状态

`panel-store` 新增：
- `repos: RepoInfo[]`
- `activeRepo: string | null`（当前选中的仓库路径）

### UI 行为

- 单仓库：隐藏仓库选择器，行为与之前一致
- 多仓库：顶部工具栏显示下拉选择器，默认选中第一个仓库
- 切换仓库时：重新加载 graph 数据、恢复该仓库的选中 commit
