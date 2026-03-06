import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";

import Destinos from "./pages/Destinos";
import Transportes from "./pages/Transportes";
import Viagens from "./pages/Viagens";
import Viajantes from "./pages/Viajantes";
import Hospedagens from "./pages/Hospedagens";
import ViagemDetalhes from "./pages/ViagemDetalhes";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* HOME DO DASHBOARD */}
        <Route index element={<DashboardHome />} />

        <Route path="destinos" element={<Destinos />} />
        <Route path="viagens" element={<Viagens />} />
        <Route path="viajantes" element={<Viajantes />} />
        <Route path="hospedagens" element={<Hospedagens />} />
        <Route path="transportes" element={<Transportes />} />
        <Route path="viagens/:id" element={<ViagemDetalhes />} />
      </Route>
    </Routes>
  );
}

export default App;