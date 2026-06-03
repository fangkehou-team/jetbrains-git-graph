## Context

The Commit panel (`webview/src/commit/`) renders working tree changes grouped into Staged, Changes, and Unversioned Files. Users currently interact with files via:
- Checkbox selection + Toolbar actions
- Right-click context menu (`CommitFileContextMenu`)
- Double-click to show diff
- Keyboard navigation (arrow keys)

The store (`commit-store.ts`) exposes `stageFile` / `unstageFile` for single-file operations and `stageAll` / `unstageAll` for repo-wide operations. There is no bulk stage/unstage for arbitrary file lists.

## Goals / Non-Goals

**Goals:**
- Add hover inline action buttons to file rows, directory rows, and group headers
- Reorder groups so Staged appears above Changes
- Preserve all existing interactions (context menu, double-click, checkbox, keyboard)
- Support bulk stage/unstage for directories and groups

**Non-Goals:**
- Replacing or removing the right-click context menu
- Changing the checkbox-based selection model
- Adding hover buttons to the Shelf or Stash tabs
- Modifying the commit message area

## Decisions

### Button placement: replace status label on hover
**Decision:** On hover, action buttons appear on the right side of the row and the status label (for files) or file count (for directories/headers) is hidden.

**Rationale:** This matches VSCode's Source Control panel behavior exactly. The `flex: 1` on the file name ensures the name area shrinks via `text-overflow: ellipsis`, giving buttons space without breaking layout.

**Alternative considered:** Floating absolute-positioned buttons. Rejected because they could overlap with long paths and require z-index management.

### Store: add bulk stageFiles / unstageFiles actions
**Decision:** Add `stageFiles(filePaths[], workspaceRoot)` and `unstageFiles(filePaths[], workspaceRoot)` to the commit store, backed by new message handlers in `extension.ts`.

**Rationale:** Directory and group-level hover buttons need to stage/unstage multiple files at once. The existing `stageAll` uses `git add -A` (cannot target specific files), and `stageFile` only handles one file per call.

**Alternative considered:** Calling `stageFile` in a loop. Rejected because it sends N messages and triggers N re-renders.

### Group type prop drilling
**Decision:** Pass `groupType: 'changes' | 'staged' | 'unversioned'` from `CommitTab` through `FileGroup` → `RepoAwareFileList` → `DirectoryTree` / `FileItem`.

**Rationale:** Components need to know which buttons to render (+ or -). Prop drilling is straightforward here because the component tree is shallow and no other state management is needed.

**Alternative considered:** Deriving group type from `file.staged` at the file level. Rejected because directory rows and group headers don't have a single `staged` value.

### CSS: hover visibility via display:flex/none
**Decision:** Use `.row:hover .actions { display: flex; }` and `.row:hover .status { display: none; }` for show/hide.

**Rationale:** Simple, performant, and works without JavaScript state. A CSS transition on opacity can be added for smooth fade.

## Risks / Trade-offs

- **[Risk]** Buttons appearing on hover may feel jumpy if the container scrolls or layout shifts.
  → **Mitigation:** Buttons use `flex-shrink: 0` and fixed widths. The file name uses `text-overflow: ellipsis` so no reflow occurs.

- **[Risk]** Touch devices (tablets with VSCode) have no hover.
  → **Mitigation:** The right-click context menu remains fully functional; hover buttons are an enhancement, not a replacement.

- **[Risk]** Bulk unstage for many files could be slow.
  → **Mitigation:** `unstageFiles` handler batches all files into a single `git reset HEAD -- file1 file2 ...` call.

## Migration Plan

No migration needed. This is a pure UI enhancement with no breaking changes.

## Open Questions

- Should the Open File button also appear on directory rows? (Decision: no — directories cannot be opened as files. Only stage/unstage buttons on directories.)
