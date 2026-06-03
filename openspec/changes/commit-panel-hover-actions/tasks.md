## 1. Extension Backend

- [x] 1.1 Add `stageFiles` message handler in `src/extension.ts`
- [x] 1.2 Add `unstageFiles` message handler in `src/extension.ts`

## 2. Store Layer

- [x] 2.1 Add `stageFiles(filePaths[], workspaceRoot)` action to `commit-store.ts`
- [x] 2.2 Add `unstageFiles(filePaths[], workspaceRoot)` action to `commit-store.ts`

## 3. FileItem Component

- [x] 3.1 Add `onStage`, `onUnstage`, `onOpenFile` optional props to `FileItem.tsx`
- [x] 3.2 Render hover action buttons container in `FileItem.tsx`
- [x] 3.3 Add Stage (+), Unstage (-), and Open File icons inline in `FileItem.tsx`

## 4. CommitTab Component

- [x] 4.1 Add `groupType` prop and pass through `FileGroup` → `RepoAwareFileList` → `DirectoryTree` / `FileItem`
- [x] 4.2 Render hover action buttons on directory rows in `DirNodeView`
- [x] 4.3 Render hover action buttons on group headers in `FileGroup`
- [x] 4.4 Bind stage/unstage/open handlers for file rows, directory rows, and group headers
- [x] 4.5 Reorder file groups: Staged above Changes in `CommitTab.tsx`

## 5. CSS Styling

- [x] 5.1 Add `.commit-file-actions` styles for hover button container in `commit.css`
- [x] 5.2 Add hover visibility rules (show buttons, hide status/count) in `commit.css`
- [x] 5.3 Add button hover feedback styles in `commit.css`

## 6. Bug Fixes (discovered during implementation)

- [x] 6.1 Toolbar Rollback and Show Diff buttons missing `onClick` handlers
- [x] 6.2 Default file selection: `fetchChanges` auto-checked all files → changed to unchecked
- [x] 6.3 Context menu "Shelve Changes..." was actually git stash → renamed to "Stash Changes..."
- [x] 6.4 `showFileHistory` failed when panel already open → added visibility check + delay
- [x] 6.5 `showFileHistory` re-loaded webview on every click → skip `focus` when already visible
- [x] 6.6 `showFileHistory` used wrong relative path for non-git-root workspace folders → use git root relative path

## 7. Verification

- [x] 7.1 Run TypeScript type check (`pnpm tsc --noEmit`)
- [x] 7.2 Run Biome lint (`pnpm biome check`)
- [x] 7.3 Build the extension (`pnpm build`)
