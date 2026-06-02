# 多根工作区支持 (Multi-Root Workspace Support)

## 背景

当前插件仅支持单 Git 仓库的工作区。当用户打开包含多个 Git 仓库的 VS Code workspace 时，插件无法正确识别和操作多个仓库。

## 目标

1. 支持 VS Code 多根工作区（multi-root workspace）
2. 当 workspace 包含多个 Git 仓库时，Git Graph 面板可切换查看不同仓库
3. Commit 面板能正确显示所有仓库的更改，并按仓库分组
4. Diff、Merge、冲突解决等功能支持多仓库路由
5. 动态增删 workspace folder 后自动检测对应的 Git 仓库

## 主要修改范围

- 后端：`src/extension.ts`、`src/git/gitService.ts`、各类 handler
- 前端：`webview/src/panel/`（Git Graph 面板）、`webview/src/commit/`（Commit 面板）
