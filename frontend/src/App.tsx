import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { TopologyTab } from "./features/topology/TopologyTab";
import { IncidentsTab } from "./features/incidents/IncidentsTab";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<TopologyTab />} />
        <Route path="/incidents" element={<IncidentsTab />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
