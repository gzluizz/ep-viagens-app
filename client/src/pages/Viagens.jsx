import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function Viagens() {
  const [viagens, setViagens] = useState([]);
  const [hospedagens, setHospedagens] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    hospedagem_id: "",
    transporte_id: "",
    data_inicio: "",
    data_fim: "",
    status: "planejada",
    observacoes: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);

      const [viagensData, hospedagensData, transportesData] = await Promise.all([
        apiFetch("/viagens/"),
        apiFetch("/hospedagens/"),
        apiFetch("/transportes/"),
      ]);

      setViagens(Array.isArray(viagensData) ? viagensData : viagensData.results || []);
      setHospedagens(Array.isArray(hospedagensData) ? hospedagensData : hospedagensData.results || []);
      setTransportes(Array.isArray(transportesData) ? transportesData : transportesData.results || []);
    } catch (error) {
      console.error(error);
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
        await apiFetch(`/viagens/${editingId}/`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/viagens/", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setEditingId(null);
      setForm({
        titulo: "",
        hospedagem_id: "",
        transporte_id: "",
        data_inicio: "",
        data_fim: "",
        status: "planejada",
        observacoes: "",
      });

      fetchAll();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(viagem) {
    setForm({
      titulo: viagem.titulo,
      hospedagem_id: viagem.hospedagem_id,
      transporte_id: viagem.transporte_id,
      data_inicio: viagem.data_inicio,
      data_fim: viagem.data_fim,
      status: viagem.status,
      observacoes: viagem.observacoes || "",
    });
    setEditingId(viagem.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir esta viagem?")) return;

    await apiFetch(`/viagens/${id}/`, { method: "DELETE" });
    fetchAll();
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <h2>Viagens</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            required
          />

          <br /><br />

          <select
            name="hospedagem_id"
            value={form.hospedagem_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a hospedagem</option>
            {hospedagens.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nome} ({h.destino?.cidade} - {h.destino?.estado})
              </option>
            ))}
          </select>

          <select
            name="transporte_id"
            value={form.transporte_id}
            onChange={handleChange}
            required
            style={{ marginLeft: 10 }}
          >
            <option value="">Selecione o transporte</option>
            {transportes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tipo} - {t.empresa}
              </option>
            ))}
          </select>

          <br /><br />

          <input
            type="date"
            name="data_inicio"
            value={form.data_inicio}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="data_fim"
            value={form.data_fim}
            onChange={handleChange}
            required
            style={{ marginLeft: 10 }}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ marginLeft: 10 }}
          >
            <option value="planejada">Planejada</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
            <option value="finalizada">Finalizada</option>
          </select>

          <br /><br />

          <textarea
            name="observacoes"
            placeholder="Observações"
            value={form.observacoes}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%" }}
          />

          <br /><br />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Criar Viagem"}
          </button>
        </form>

        {/* LISTA */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Título</th>
                <th>Destino</th>
                <th>Hospedagem</th>
                <th>Transporte</th>
                <th>Status</th>
                <th>Período</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {viagens.map((v) => (
                <tr key={v.id}>
                  <td>{v.titulo}</td>
                  <td>{v.hospedagem?.destino?.cidade} - {v.hospedagem?.destino?.estado}</td>
                  <td>{v.hospedagem?.nome}</td>
                  <td>{v.transporte?.tipo} - {v.transporte?.empresa}</td>
                  <td>{v.status}</td>
                  <td>{v.data_inicio} → {v.data_fim}</td>
                  <td>
                    <button onClick={() => handleEdit(v)}>Editar</button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      style={{ marginLeft: 5 }}
                    >
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

export default Viagens;