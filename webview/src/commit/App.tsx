import { useEffect } from "react";
import { useCommitStore } from "../shared/store/commit-store";
import { CommitTab } from "./components/CommitTab";
import { IdeaShelfTab } from "./components/IdeaShelfTab";
import { ShelfTab } from "./components/ShelfTab";
import "./commit.css";

export function CommitApp() {
  const {
    activeTab,
    setActiveTab,
    fetchChanges,
    fetchShelves,
    fetchIdeaShelves,
  } = useCommitStore();

  useEffect(() => {
    fetchChanges();
    fetchShelves();
    fetchIdeaShelves();
  }, [fetchChanges, fetchShelves, fetchIdeaShelves]);

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
        <button
          type="button"
          className={`commit-tab ${activeTab === "stash" ? "active" : ""}`}
          onClick={() => setActiveTab("stash")}
        >
          Stash
        </button>
      </div>
      <div className="commit-content">
        {activeTab === "commit" && <CommitTab />}
        {activeTab === "shelf" && <IdeaShelfTab />}
        {activeTab === "stash" && <ShelfTab />}
      </div>
    </div>
  );
}
