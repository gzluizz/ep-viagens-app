import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ width: 200, padding: 20, background: "#bdbbbb", height: "100vh" }}>
      <h2>EP Viagens</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/destinos">Destinos</Link></li>
          <li><Link to="/viagens">Viagens</Link></li>
          <li><Link to="/viajantes">Viajantes</Link></li>
          <li><Link to="/hospedagens">Hospedagens</Link></li>
          <li><Link to="/transportes">Transportes</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;