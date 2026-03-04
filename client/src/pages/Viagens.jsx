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
    vagas_disponiveis: "",
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

    if (new Date(form.data_inicio) > new Date(form.data_fim)) {
      alert("A data de início não pode ser depois da data de fim.");
      return;
    }

    const payload = {
      titulo: form.titulo,
      hospedagem_id: Number(form.hospedagem_id),
      transporte_id: Number(form.transporte_id),
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      status: form.status,
      observacoes: form.observacoes,
      vagas_disponiveis: Number(form.vagas_disponiveis),
    };

    try {
      if (editingId) {
        await apiFetch(`/viagens/${editingId}/`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/viagens/", {
          method: "POST",
          body: JSON.stringify(payload),
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
        vagas_disponiveis: "",
      });

      fetchAll();
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar a viagem. Verifique os dados.");
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
      vagas_disponiveis: viagem.vagas_disponiveis || "",
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

      <div>
        <h2>Viagens</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            required
          />

          <br />

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
          >
            <option value="">Selecione o transporte</option>
            {transportes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tipo} - {t.empresa}
              </option>
            ))}
          </select>

          <br />

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
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="planejada">Planejada</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
            <option value="finalizada">Finalizada</option>
          </select>

          <input
            type="number"
            name="vagas_disponiveis"
            placeholder="Vagas disponíveis"
            value={form.vagas_disponiveis}
            onChange={handleChange}
            required
          />

          <br />

          <textarea
            name="observacoes"
            placeholder="Observações"
            value={form.observacoes}
            onChange={handleChange}
            rows="3"
          />

          <br />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Criar Viagem"}
          </button>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>Título</th>
                <th>Destino</th>
                <th>Hospedagem</th>
                <th>Transporte</th>
                <th>Status</th>
                <th>Período</th>
                <th>Vagas Disponíveis</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {viagens.map((v) => (
                <tr key={v.id}>
                  <td>{v.titulo}</td>
                  <td>
                    {v.hospedagem?.destino?.cidade} - {v.hospedagem?.destino?.estado}
                  </td>
                  <td>{v.hospedagem?.nome}</td>
                  <td>{v.transporte?.tipo} - {v.transporte?.empresa}</td>
                  <td>{v.status}</td>
                  <td>{v.data_inicio} → {v.data_fim}</td>
                  <td>{v.vagas_disponiveis}</td>
                  <td>
                    <button onClick={() => handleEdit(v)}>Editar</button>
                    <button onClick={() => handleDelete(v.id)}>
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