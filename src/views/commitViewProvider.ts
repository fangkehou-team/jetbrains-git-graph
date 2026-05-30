import * as vscode from "vscode";
import type { MessageRouter } from "../messages/messageRouter";
import { getWebviewHtml } from "./html";

export class CommitViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "git-brains.commitPanel";

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly messageRouter: MessageRouter,
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "dist")],
    };

    webview.html = getWebviewHtml(webview, this.extensionUri, "commit");

    const routerDisposable = this.messageRouter.registerWebview(webview);
    webviewView.onDidDispose(() => routerDisposable.dispose());

    // When commit panel becomes visible, also show the Git Log panel and refresh both
    // When hidden (clicked again to collapse), hide the Git Log panel too
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        void vscode.commands.executeCommand("git-brains.gitLog.focus");
        // Trigger refresh for both commit panel and git log
        this.messageRouter.broadcastEvent("commitStateChanged", {});
        this.messageRouter.broadcastEvent("gitStateChanged", { scope: "all" });
      } else {
        void vscode.commands.executeCommand("workbench.action.closePanel");
      }
    });
  }
}
