import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 20 }}>
        <h1>Dashboard</h1>
        <Outlet /> {/* Aqui entra o conteúdo da seção selecionada */}
      </div>
    </div>
  );
}

export default Dashboard;