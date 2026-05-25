import { Allotment } from "allotment";
import { useEffect, useState } from "react";
import "allotment/dist/style.css";
import { bridge } from "../shared/bridge";
import { usePreventSelect } from "../shared/hooks/usePreventSelect";
import { usePanelStore } from "../shared/store/panel-store";
import { BranchTree } from "./components/BranchTree";
import { DetailPanel } from "./components/DetailPanel";
import { GitGraphPanel } from "./components/GitGraphPanel";
import { Toolbar } from "./components/Toolbar";

function ProgressBar({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 10000,
        overflow: "hidden",
        background: "var(--vscode-progressBar-background, rgba(0,122,204,0.2))",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "30%",
          background: "var(--vscode-progressBar-background, #007acc)",
          animation: "progress-slide 1.5s infinite ease-in-out",
        }}
      />
      <style>
        {`@keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(433%); }
        }`}
      </style>
    </div>
  );
}

export function PanelApp() {
  const loading = usePanelStore((s) => s.loading);
  const commits = usePanelStore((s) => s.commits);
  const fetchInitialData = usePanelStore((s) => s.fetchInitialData);
  const [operationInProgress, setOperationInProgress] = useState(false);

  const middleRef = usePreventSelect();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Listen for operation progress events
  useEffect(() => {
    return bridge.onEvent((event) => {
      if (event === "operationStart") {
        setOperationInProgress(true);
      } else if (event === "operationEnd") {
        setOperationInProgress(false);
      }
    });
  }, []);

  if (loading && commits.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          opacity: 0.5,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <ProgressBar visible={operationInProgress || loading} />
      <Allotment>
        <Allotment.Pane preferredSize="15%" minSize={140}>
          <BranchTree />
        </Allotment.Pane>
        <Allotment.Pane minSize={400}>
          <div
            ref={middleRef}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Toolbar />
            <GitGraphPanel />
          </div>
        </Allotment.Pane>
        <Allotment.Pane preferredSize="30%" minSize={250}>
          <DetailPanel />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
