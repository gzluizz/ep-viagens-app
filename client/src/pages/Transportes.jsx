import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function Transportes() {
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = { tipo: "", empresa: "", descricao: "" };
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTransportes();
  }, []);

  async function fetchTransportes() {
    try {
      setLoading(true);
      const data = await apiFetch("/transportes/");

      if (Array.isArray(data)) {
        setTransportes(data);
      } else if (data.results) {
        setTransportes(data.results);
      } else {
        setTransportes([]);
      }
    } catch {
      setError("Erro ao carregar transportes");
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
        await apiFetch(`/transportes/${editingId}/`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/transportes/", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setForm({ tipo: "", empresa: "", descricao: "" });
      setEditingId(null);
      fetchTransportes();
    } catch {
      setError("Erro ao salvar transporte");
    }
  }

  function handleEdit(transporte) {
    setForm({
      tipo: transporte.tipo,
      empresa: transporte.empresa,
      descricao: transporte.descricao,
    });
    setEditingId(transporte.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este transporte?")) return;

    try {
      await apiFetch(`/transportes/${id}/`, { method: "DELETE" });
      fetchTransportes();
    } catch {
      setError("Erro ao excluir transporte");
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div>
        <h2>Transportes</h2>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="tipo"
            placeholder="Tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="empresa"
            placeholder="Empresa"
            value={form.empresa}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Adicionar Transporte"}
          </button>
        </form>

        {loading ? (
          <p>Carregando transportes...</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Empresa</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transportes.map((t) => (
                <tr key={t.id}>
                  <td>{t.tipo}</td>
                  <td>{t.empresa}</td>
                  <td>{t.descricao}</td>
                  <td>
                    <button onClick={() => handleEdit(t)}>Editar</button>
                    <button onClick={() => handleDelete(t.id)}>
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

export default Transportes;