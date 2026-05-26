import { useCallback, useRef, useState } from "react";
import { useCommitStore } from "../../shared/store/commit-store";

export function CommitMessageArea() {
  const {
    commitMessage,
    setCommitMessage,
    amend,
    setAmend,
    commit,
    commitAndPush,
    loading,
    selectedFiles,
  } = useCommitStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasSelectedFiles = selectedFiles.size > 0;
  const canCommit =
    commitMessage.trim().length > 0 && hasSelectedFiles && !loading;

  const handleCommit = useCallback(async () => {
    if (!canCommit) return;
    await commit();
  }, [canCommit, commit]);

  const handleCommitAndPush = useCallback(async () => {
    if (!canCommit) return;
    setShowDropdown(false);
    await commitAndPush();
  }, [canCommit, commitAndPush]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Ctrl/Cmd + Enter to commit
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleCommit();
      }
    },
    [handleCommit],
  );

  return (
    <div className="commit-message-area">
      <textarea
        className="commit-message-textarea"
        placeholder="Commit message (Ctrl+Enter to commit)"
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
      />

      <div className="commit-amend-row">
        <label>
          <input
            type="checkbox"
            checked={amend}
            onChange={(e) => setAmend(e.target.checked)}
          />
          Amend
        </label>
        <HistoryIcon />
      </div>

      <div className="commit-buttons">
        <button
          type="button"
          className="commit-btn commit-btn-primary"
          disabled={!canCommit}
          onClick={handleCommit}
        >
          Commit
        </button>

        <div className="commit-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="commit-btn commit-btn-secondary"
            disabled={!canCommit}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Commit and Push...
          </button>
          {showDropdown && (
            <div className="commit-dropdown-menu">
              <button
                type="button"
                className="commit-dropdown-item"
                onClick={handleCommitAndPush}
              >
                Commit and Push
              </button>
              <div className="commit-dropdown-separator" />
              <button
                type="button"
                className="commit-dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ opacity: 0.5 }}
    >
      <path d="M13.507 12.324a7 7 0 0 0 .065-8.56A7 7 0 0 0 2 4.393V2H1v3.5l.5.5H5V5H2.811a6.008 6.008 0 1 1-.135 5.77l-.887.462a7 7 0 0 0 11.718 1.092zM8 4v4.5l.5.5H12v-1H9V4H8z" />
    </svg>
  );
}
