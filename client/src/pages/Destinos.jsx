import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function Destinos() {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    cidade: "",
    estado: "",
    pais: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDestinos();
  }, []);

  async function fetchDestinos() {
    try {
      setLoading(true);
      const data = await apiFetch("/destinos/");

      if (Array.isArray(data)) {
        setDestinos(data);
      } else if (data.results) {
        setDestinos(data.results);
      } else {
        setDestinos([]);
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
    setForm({
      cidade: destino.cidade,
      estado: destino.estado,
      pais: destino.pais
    });
    setEditingId(destino.id);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      await apiFetch(`/destinos/${deleteId}/`, { method: "DELETE" });
      setDeleteId(null);
      fetchDestinos();
    } catch {
      setError("Erro ao excluir destino");
    }
  }

  return (
    <div className="layout" style={{ display: "flex" }}>
      <Sidebar />

      <div className="content">
        <h2>Destinos</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="form-destino">
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
          />

          <input
            type="text"
            name="pais"
            placeholder="País"
            value={form.pais}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Adicionar Destino"}
          </button>
        </form>

        {loading ? (
          <p>Carregando destinos...</p>
        ) : (
          <table>
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
                    <button onClick={() => handleDelete(d.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal Confirmação Exclusão */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este destino?</p>

              <button onClick={confirmDelete}>
                Sim, excluir
              </button>

              <button onClick={() => setDeleteId(null)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Destinos;