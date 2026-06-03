## Why

The Commit panel currently requires users to right-click files to access common actions like stage/unstage or open file. This context-menu-driven workflow is slower than the inline hover-action pattern used by VSCode's Source Control panel, where frequently-used actions appear directly on each row when hovered. Adding hover inline buttons will significantly speed up the daily staging/unstaging workflow while preserving the existing right-click context menu for less common operations.

## What Changes

- Add hover inline action buttons to **file rows**, **directory rows**, and **group headers** in the Commit panel's file list
- Buttons appear on the right side of each row on hover, replacing the status label / file count
- Changes/Unversioned groups show **Stage (+)** and **Open File** buttons
- Staged group shows **Unstage (-)** and **Open File** buttons
- Reorder file groups so **Staged appears above Changes** (matching VSCode convention)
- Add bulk `stageFiles` / `unstageFiles` message handlers and store actions for directory/group-level operations
- Preserve all existing interactions: right-click context menu, double-click diff, checkbox selection, keyboard navigation

## Capabilities

### New Capabilities
- `commit-hover-actions`: Inline hover action buttons on file rows, directory rows, and group headers in the Commit panel

### Modified Capabilities
- (none — this is a UI interaction enhancement that does not change spec-level requirements of existing capabilities)

## Impact

- **Webview frontend**: `FileItem.tsx`, `CommitTab.tsx`, `commit.css`
- **Extension backend**: `extension.ts` (new message handlers)
- **Store**: `commit-store.ts` (new bulk stage/unstage actions)
