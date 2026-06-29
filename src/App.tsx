// File: src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics"; // NEW

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} /> {/* NEW */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
