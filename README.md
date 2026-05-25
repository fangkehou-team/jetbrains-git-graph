<a name="readme-top"></a>

<div align="center">

<h1>JetGit (Fork)</h1>

JetBrains-style Git visualization for VS Code — Git Graph, Diff viewer, and 3-Way Merge Editor in one extension.

> This is a fork of [zhyc9de/jet-git](https://github.com/zhyc9de/jet-git) with additional IntelliJ IDEA-style features.

</div>

## What's New in This Fork

### Branch Context Menu (IntelliJ-style)

Right-click any branch in the left panel to access:

- **Checkout** — switch to the branch
- **New Branch from...** — create a new branch from the selected one
- **Checkout and Rebase onto current** — checkout and rebase onto current branch
- **Rebase current onto branch** — rebase current branch onto selected
- **Merge into current** — merge selected branch into current
- **Rename** — rename a local branch
- **Delete** — delete branch (with force-delete fallback)
- **Update** — pull from remote
- **Push** — push to origin

### Commit Context Menu

Right-click any commit in the history to access:

- **Copy Revision Number** — copy full hash to clipboard
- **Cherry-Pick** — cherry-pick the commit
- **Checkout Revision** — checkout the commit (detached HEAD)
- **Reset Current Branch to Here** — soft/mixed/hard reset
- **Revert Commit** — create a revert commit
- **New Branch...** — create branch from this commit
- **New Tag...** — create tag at this commit

### Changed Files Context Menu

Right-click any file in the Changed Files panel:

- **Show Diff** — open diff editor
- **Edit Source** — open file in editor
- **Open Repository Version** — view file at that commit
- **Revert Selected Changes** — restore file to parent commit state
- **Cherry-Pick Selected Changes** — apply file changes to working tree
- **Copy Path / Copy File Name** — copy to clipboard

### UI Enhancements

- **Branch search** — filter branches/tags by name in the left panel
- **Commit filters** — filter by Branch, User, and Date range in the toolbar
- **Resizable columns** — drag to adjust Author, Date, and Hash column widths
- **Hash column** — commit short hash displayed in a dedicated column
- **Current branch indicator** — shows branch name next to "Current Branch"
- **IntelliJ icons** — all icons use official IntelliJ IDEA SVG icons (Apache 2.0)
- **Context menu improvements** — proper viewport positioning, portal rendering, dismiss on outside click/scroll/blur

---

## Original Features

### Git Graph — Intuitive Commit History

![Git Graph](./images/git-graph.png)

- **Branch Tree** on the left: branches organized by Current Branch / Local / Remote / Tags
- **Commit List** in the center: color-coded branch lines with labels, author, and timestamp
- **Detail Panel** on the right: full commit message and changed file list
- Search commits and filter by branch
- Click any changed file to open the **Diff Editor**

### 3-Way Merge Editor — Clear Three-Way Merging

![3-Way Merge Editor](./images/three-way-merge.png)

- Three-column layout: **Left (Theirs)** | **Center (Result)** | **Right (Yours)**
- Conflict regions highlighted in red/green
- Per-block action buttons for quick conflict resolution
- Full syntax highlighting

### Conflict List — Efficient Conflict Management

![Conflict List](./images/conflicts-list.png)

- Merge info banner with conflict file list
- Quick actions: **Accept Yours** / **Accept Theirs** / **Merge...**
- Seamless integration with VS Code Source Control panel

## Installation

Install from `.vsix` file:

1. Download the latest `.vsix` from releases
2. In VS Code: `Cmd+Shift+P` → "Extensions: Install from VSIX..."
3. Select the downloaded file

## Requirements

- VS Code 1.85.0 or later
- Git installed and available in your PATH

## Local Development

```bash
git clone https://github.com/aotemj/jetbrains-git-graph.git
cd jetbrains-git-graph
pnpm install
cd webview && pnpm install && cd ..
```

Open the project in VS Code. Press **F5** to launch the Extension Development Host.

```bash
pnpm run watch       # Watch mode (extension + webview)
pnpm run build       # Full production build
pnpm run vsce:package  # Package as .vsix
```

## Credits

- Original project: [zhyc9de/jet-git](https://github.com/zhyc9de/jet-git)
- Icons: [IntelliJ IDEA Icons](https://intellij-icons.jetbrains.design/) (Apache 2.0 License)

## License

This project is [MIT](./LICENSE) licensed.
