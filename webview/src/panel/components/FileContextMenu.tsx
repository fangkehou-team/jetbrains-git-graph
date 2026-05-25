import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { bridge } from "../../shared/bridge";
import { usePanelStore } from "../../shared/store/panel-store";
import type { DiffFile } from "../../shared/types/git";

// Inline SVG icons for menu items
function IconDiff() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M3 8h4M5 6v4" />
      <path d="M9 8h4" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M11.5 2.5l2 2-8 8H3.5v-2z" strokeLinejoin="round" />
      <path d="M9.5 4.5l2 2" />
    </svg>
  );
}

function IconRevert() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M4 7l-2 2 2 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 9h8a3 3 0 000-6H7" strokeLinecap="round" />
    </svg>
  );
}

function IconCherryPick() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <circle cx="8" cy="5" r="2.5" />
      <path d="M8 7.5v5" />
      <path d="M6 10.5c1 1 3 1 4 0" strokeLinecap="round" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <rect x="5" y="5" width="8" height="8" rx="1" />
      <path d="M3 11V3h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface FileContextMenuProps {
  x: number;
  y: number;
  file: DiffFile;
  onClose: () => void;
}

export function FileContextMenu({ x, y, file, onClose }: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedCommitHash = usePanelStore((s) => s.selectedCommitHash);
  const openDiffEditor = usePanelStore((s) => s.openDiffEditor);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const filePath = file.newPath || file.oldPath;

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;

      let top = y;
      let left = x;

      if (top + rect.height > viewportH) {
        const above = y - rect.height;
        if (above >= 4) {
          top = above;
        } else {
          top = Math.max(4, viewportH - rect.height - 4);
        }
      }
      if (left + rect.width > viewportW) {
        left = Math.max(4, viewportW - rect.width - 4);
      }

      setPosition({ top, left });
    });
  }, [x, y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleBlur = () => onClose();
    const handleScroll = (e: Event) => {
      if (
        menuRef.current &&
        e.target instanceof Node &&
        !menuRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleBlur);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleBlur);
    };
  }, [onClose]);

  const handleShowDiff = () => {
    onClose();
    if (selectedCommitHash) {
      openDiffEditor(selectedCommitHash, file);
    }
  };

  const handleEditSource = async () => {
    onClose();
    try {
      await bridge.request("openFile", { filePath });
    } catch (err) {
      console.error("Open file failed:", err);
    }
  };

  const handleOpenRepoVersion = async () => {
    onClose();
    if (selectedCommitHash) {
      try {
        await bridge.request("openFileAtRevision", {
          filePath,
          ref: selectedCommitHash,
        });
      } catch (err) {
        console.error("Open repo version failed:", err);
      }
    }
  };

  const handleCopyPath = async () => {
    onClose();
    try {
      await bridge.request("copyToClipboard", { text: filePath });
    } catch (err) {
      console.error("Copy path failed:", err);
    }
  };

  const handleCopyFileName = async () => {
    onClose();
    const fileName = filePath.split("/").pop() ?? filePath;
    try {
      await bridge.request("copyToClipboard", { text: fileName });
    } catch (err) {
      console.error("Copy filename failed:", err);
    }
  };

  const handleRevertFileChanges = async () => {
    onClose();
    if (!selectedCommitHash) return;
    const result = (await bridge.request("showConfirmMessage", {
      message: `Revert changes to '${filePath.split("/").pop()}' from this commit?`,
      confirmLabel: "Revert",
    })) as { confirmed: boolean };
    if (!result.confirmed) return;
    try {
      await bridge.request("revertFileChanges", {
        hash: selectedCommitHash,
        filePath,
      });
    } catch (err) {
      console.error("Revert file changes failed:", err);
    }
  };

  const handleCherryPickFileChanges = async () => {
    onClose();
    if (!selectedCommitHash) return;
    const result = (await bridge.request("showConfirmMessage", {
      message: `Apply changes to '${filePath.split("/").pop()}' from this commit to working tree?`,
      confirmLabel: "Apply",
    })) as { confirmed: boolean };
    if (!result.confirmed) return;
    try {
      await bridge.request("cherryPickFileChanges", {
        hash: selectedCommitHash,
        filePath,
      });
    } catch (err) {
      console.error("Cherry-pick file changes failed:", err);
    }
  };

  const items: {
    label: string;
    action: () => void;
    separator?: boolean;
    icon?: React.ReactNode;
  }[] = [
    { label: "Show Diff", action: handleShowDiff, icon: <IconDiff /> },
    { label: "", action: () => {}, separator: true },
    { label: "Edit Source", action: handleEditSource, icon: <IconEdit /> },
    { label: "Open Repository Version", action: handleOpenRepoVersion },
    { label: "", action: () => {}, separator: true },
    {
      label: "Revert Selected Changes",
      action: handleRevertFileChanges,
      icon: <IconRevert />,
    },
    {
      label: "Cherry-Pick Selected Changes",
      action: handleCherryPickFileChanges,
      icon: <IconCherryPick />,
    },
    { label: "", action: () => {}, separator: true },
    { label: "Copy Path", action: handleCopyPath, icon: <IconCopy /> },
    { label: "Copy File Name", action: handleCopyFileName, icon: <IconCopy /> },
  ];

  const menu = (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position ? position.top : -9999,
        left: position ? position.left : -9999,
        zIndex: 9999,
        background: "var(--vscode-menu-background, #252526)",
        border: "1px solid var(--vscode-menu-border, #454545)",
        borderRadius: 4,
        padding: "4px 0",
        minWidth: 180,
        maxHeight: "calc(100vh - 8px)",
        overflowY: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        visibility: position ? "visible" : "hidden",
      }}
    >
      {items.map((item, i) =>
        item.separator ? (
          <div
            key={`sep-${i}`}
            style={{
              height: 1,
              background: "var(--vscode-menu-separatorBackground, #454545)",
              margin: "4px 0",
            }}
          />
        ) : (
          <div
            key={item.label}
            onClick={item.action}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              color: "var(--vscode-menu-foreground, #ccc)",
              fontSize: "13px",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--vscode-menu-selectionBackground, #094771)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--vscode-menu-selectionForeground, #fff)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "var(--vscode-menu-foreground, #ccc)";
            }}
          >
            <span style={{ width: 14, flexShrink: 0, opacity: 0.7 }}>
              {item.icon ?? null}
            </span>
            {item.label}
          </div>
        ),
      )}
    </div>
  );

  return createPortal(menu, document.body);
}
