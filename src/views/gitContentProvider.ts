import type * as vscode from "vscode";
import type { GitService } from "../git/gitService";

export const GIT_BRAINS_SCHEME = "git-brains";

/**
 * Provides virtual document content for git file revisions.
 * Uri format: git-brains:/<filePath>?ref=<commitHash>&root=<workspaceRoot>
 * Also supports shelf diff content via an external content map.
 */
export class GitContentProvider implements vscode.TextDocumentContentProvider {
  private externalContent: Map<string, string> | null = null;

  constructor(private readonly gitServices: Map<string, GitService>) {}

  setExternalContentMap(map: Map<string, string>): void {
    this.externalContent = map;
  }

  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    // Check external content map first (used for shelf diffs)
    if (this.externalContent) {
      const external = this.externalContent.get(uri.toString());
      if (external !== undefined) {
        return external;
      }
    }

    const query = new URLSearchParams(uri.query);
    const ref = query.get("ref") ?? "";
    const filePath = uri.path.startsWith("/") ? uri.path.slice(1) : uri.path;
    const root = query.get("root") ?? undefined;
    if (!ref || !filePath) {
      return "";
    }

    // Route to the correct GitService if root is specified
    if (root) {
      const svc = this.gitServices.get(root);
      if (svc) {
        return svc.getFileContent(ref, filePath);
      }
    }

    // Fallback: try the first available GitService
    const first = this.gitServices.values().next().value as
      | GitService
      | undefined;
    if (first) {
      return first.getFileContent(ref, filePath);
    }
    return "";
  }
}
