import { useEffect } from "react";
import { useCommitStore } from "../shared/store/commit-store";
import { CommitTab } from "./components/CommitTab";
import { ShelfTab } from "./components/ShelfTab";
import "./commit.css";

export function CommitApp() {
  const { activeTab, setActiveTab, fetchChanges, fetchShelves } =
    useCommitStore();

  useEffect(() => {
    fetchChanges();
    fetchShelves();
  }, [fetchChanges, fetchShelves]);

  return (
    <div className="commit-app">
      <div className="commit-tabs">
        <button
          type="button"
          className={`commit-tab ${activeTab === "commit" ? "active" : ""}`}
          onClick={() => setActiveTab("commit")}
        >
          Commit
        </button>
        <button
          type="button"
          className={`commit-tab ${activeTab === "shelf" ? "active" : ""}`}
          onClick={() => setActiveTab("shelf")}
        >
          Shelf
        </button>
      </div>
      <div className="commit-content">
        {activeTab === "commit" ? <CommitTab /> : <ShelfTab />}
      </div>
    </div>
  );
}
