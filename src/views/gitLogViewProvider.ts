import * as vscode from "vscode";
import type { MessageRouter } from "../messages/messageRouter";
import { getWebviewHtml } from "./html";

export class GitLogViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "git-brains.gitLog";
  private webviewView?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly messageRouter: MessageRouter,
  ) {}

  /** Check if the Git Log panel is currently visible */
  isVisible(): boolean {
    return this.webviewView?.visible ?? false;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    this.webviewView = webviewView;
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "dist")],
    };

    webview.html = getWebviewHtml(webview, this.extensionUri, "panel");

    const routerDisposable = this.messageRouter.registerWebview(webview);
    webviewView.onDidDispose(() => {
      this.webviewView = undefined;
      routerDisposable.dispose();
    });
  }
}
