import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function Destinos() {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ cidade: "", estado: "", pais: "" });
  const [editingId, setEditingId] = useState(null);

  // Carregar destinos
  useEffect(() => {
    fetchDestinos();
  }, []);

async function fetchDestinos() {
  try {
    setLoading(true);
    const data = await apiFetch("/destinos/");
    
    // Certifique-se que data é um array
    if (Array.isArray(data)) {
      setDestinos(data);
    } else if (data.results) {
      // Se DRF estiver usando PageNumberPagination
      setDestinos(data.results);
    } else {
      setDestinos([]); // fallback
    }

  } catch {
    setError("Erro ao carregar destinos");
  } finally {
    setLoading(false);
  }
}

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await apiFetch(`/destinos/${editingId}/`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/destinos/", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm({ cidade: "", estado: "", pais: "" });
      setEditingId(null);
      fetchDestinos();
    } catch {
      setError("Erro ao salvar destino");
    }
  }

  function handleEdit(destino) {
    setForm({ cidade: destino.cidade, estado: destino.estado, pais: destino.pais });
    setEditingId(destino.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este destino?")) return;
    try {
      await apiFetch(`/destinos/${id}/`, { method: "DELETE" });
      fetchDestinos();
    } catch {
      setError("Erro ao excluir destino");
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 20 }}>
        <h2>Destinos</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            value={form.cidade}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="estado"
            placeholder="Estado"
            value={form.estado}
            onChange={handleChange}
            required
            style={{ marginLeft: 10 }}
          />
          <input
            type="text"
            name="pais"
            placeholder="País"
            value={form.pais}
            onChange={handleChange}
            required
            style={{ marginLeft: 10 }}
          />
          <button type="submit" style={{ marginLeft: 10 }}>
            {editingId ? "Salvar Alterações" : "Adicionar Destino"}
          </button>
        </form>

        {loading ? (
          <p>Carregando destinos...</p>
        ) : (
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Cidade</th>
                <th>Estado</th>
                <th>País</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {destinos.map((d) => (
                <tr key={d.id}>
                  <td>{d.cidade}</td>
                  <td>{d.estado}</td>
                  <td>{d.pais}</td>
                  <td>
                    <button onClick={() => handleEdit(d)}>Editar</button>
                    <button onClick={() => handleDelete(d.id)} style={{ marginLeft: 5 }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Destinos;