import { usePreventSelect } from "../../shared/hooks/usePreventSelect";
import { usePanelStore } from "../../shared/store/panel-store";
import type { Commit, LaneInfo, RefInfo } from "../../shared/types/git";

export const ROW_HEIGHT = 28;

const REF_COLORS: Record<string, { bg: string; fg: string }> = {
  branch: { bg: "#deefe3", fg: "#24663a" },
  "remote-branch": { bg: "#eee7ff", fg: "#5f4aa1" },
  tag: { bg: "#fff1d9", fg: "#7c5a08" },
  HEAD: { bg: "#e2eeff", fg: "#1f4f86" },
};

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function buildRefDisplayItems(refs: RefInfo[]): Array<{
  key: string;
  type: RefInfo["type"];
  label: string;
}> {
  const branchRef = refs.find((ref) => ref.type === "branch");
  const hasHead = refs.some((ref) => ref.type === "HEAD");
  const seen = new Set<string>();

  // Group refs by type for compact display
  const grouped = new Map<string, string[]>();

  for (const ref of refs) {
    if (hasHead && ref.type === "branch") continue; // Skip branch if HEAD is present
    const label =
      ref.type === "HEAD" ? (branchRef ? branchRef.name : "HEAD") : ref.name;
    if (!label.trim()) continue;

    const type = ref.type === "HEAD" ? "HEAD" : ref.type;
    if (!grouped.has(type)) grouped.set(type, []);
    const list = grouped.get(type)!;
    if (!list.includes(label.trim())) {
      list.push(label.trim());
    }
  }

  const result: Array<{ key: string; type: RefInfo["type"]; label: string }> =
    [];

  for (const [type, labels] of grouped) {
    const dedupeKey = `${type}:${labels.join(",")}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    // Compact: merge multiple refs of same type with " & "
    const compactLabel =
      labels.length <= 2
        ? labels.join(" & ")
        : `${labels[0]} +${labels.length - 1}`;

    result.push({
      key: `${type}:${labels[0]}`,
      type: type as RefInfo["type"],
      label: compactLabel,
    });
  }

  return result;
}

export interface ColumnWidths {
  author: number;
  date: number;
  hash: number;
}

export function CommitRow({
  commit,
  lane,
  graphWidth,
  columnWidths,
  onCommitClick,
  onContextMenu,
}: {
  commit: Commit;
  lane: LaneInfo | undefined;
  graphWidth: number;
  columnWidths: ColumnWidths;
  onCommitClick: (event: React.MouseEvent, hash: string) => void;
  onContextMenu?: (event: React.MouseEvent, commit: Commit) => void;
}) {
  const selectedCommitHashes = usePanelStore((s) => s.selectedCommitHashes);
  const setHoveredColumn = usePanelStore((s) => s.setHoveredColumn);
  const rowRef = usePreventSelect<HTMLDivElement>();

  const isSelected = selectedCommitHashes.includes(commit.hash);
  const col = lane?.column ?? 0;
  const refItems = buildRefDisplayItems(commit.refs);

  return (
    <div
      ref={rowRef}
      className={`selectable-row${isSelected ? " selected" : ""}`}
      onClick={(event) => onCommitClick(event, commit.hash)}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(e, commit);
        }
      }}
      onMouseEnter={() => setHoveredColumn(col)}
      onMouseLeave={() => setHoveredColumn(null)}
      style={{
        display: "flex",
        alignItems: "center",
        height: ROW_HEIGHT,
        paddingLeft: graphWidth,
        paddingRight: 8,
        color: isSelected ? "var(--selected-fg)" : "inherit",
      }}
    >
      {/* Subject + refs column (flex) */}
      <span
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          paddingRight: 8,
          gap: 6,
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {commit.subject}
        </span>
        {refItems.length > 0 && (
          <span style={{ display: "inline-flex", gap: 3, flexShrink: 0 }}>
            {refItems.map((item) => {
              const colors = REF_COLORS[item.type] ?? REF_COLORS.branch;
              return (
                <span
                  key={item.key}
                  style={{
                    padding: "0 5px",
                    borderRadius: 3,
                    display: "inline-block",
                    fontSize: "0.75em",
                    fontWeight: 500,
                    lineHeight: "16px",
                    background: colors.bg,
                    color: colors.fg,
                    border: "1px solid #00000015",
                    whiteSpace: "nowrap",
                    verticalAlign: "middle",
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={item.label}
                >
                  {item.label}
                </span>
              );
            })}
          </span>
        )}
      </span>

      {/* Author column */}
      <span
        style={{
          flexShrink: 0,
          width: columnWidths.author,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          opacity: 0.7,
          paddingLeft: 8,
        }}
      >
        {commit.authorName}
      </span>

      {/* Date column */}
      <span
        style={{
          flexShrink: 0,
          width: columnWidths.date,
          textAlign: "right",
          opacity: 0.5,
          paddingLeft: 8,
        }}
      >
        {formatDateTime(commit.authorDate)}
      </span>

      {/* Hash column */}
      <span
        style={{
          flexShrink: 0,
          width: columnWidths.hash,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          opacity: 0.5,
          paddingLeft: 8,
          fontFamily: "monospace",
          fontSize: "0.9em",
        }}
      >
        {commit.shortHash}
      </span>
    </div>
  );
}
