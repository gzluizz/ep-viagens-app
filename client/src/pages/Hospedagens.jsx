import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function Hospedagens() {
  const [hospedagens, setHospedagens] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    destino_id: "",
  });

  useEffect(() => {
    fetchHospedagens();
    fetchDestinos();
  }, []);

  async function fetchHospedagens() {
    try {
      setLoading(true);
      const data = await apiFetch("/hospedagens/");
      setHospedagens(Array.isArray(data) ? data : data.results || []);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDestinos() {
    const data = await apiFetch("/destinos/");
    setDestinos(Array.isArray(data) ? data : data.results || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      nome: form.nome,
      endereco: form.endereco,
      telefone: form.telefone,
      email: form.email,
      destino_id: Number(form.destino_id),
    };

    if (editingId) {
      await apiFetch(`/hospedagens/${editingId}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await apiFetch("/hospedagens/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    setEditingId(null);
    setForm({
      nome: "",
      endereco: "",
      telefone: "",
      email: "",
      destino_id: "",
    });

    fetchHospedagens();
  }

  function handleEdit(h) {
    setForm({
      nome: h.nome,
      endereco: h.endereco,
      telefone: h.telefone,
      email: h.email,
      destino_id: h.destino?.id || "",
    });
    setEditingId(h.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir esta hospedagem?")) return;

    await apiFetch(`/hospedagens/${id}/`, { method: "DELETE" });
    fetchHospedagens();
  }

  return (
    <div style={{ display: "flex" }}>
      
      <div>
        <h2>Hospedagens</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <br />

          <input
            name="endereco"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleChange}
            required
          />

          <br />

          <select
            name="destino_id"
            value={form.destino_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um destino</option>
            {destinos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.cidade} - {d.estado} - {d.pais}
              </option>
            ))}
          </select>

          <br />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Criar Hospedagem"}
          </button>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Destino</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {hospedagens.map((h) => (
                <tr key={h.id}>
                  <td>{h.nome}</td>
                  <td>
                    {h.destino
                      ? `${h.destino.cidade} - ${h.destino.estado} - ${h.destino.pais}`
                      : ""}
                  </td>
                  <td>{h.telefone}</td>
                  <td>{h.email}</td>
                  <td>
                    <button onClick={() => handleEdit(h)}>Editar</button>
                    <button onClick={() => handleDelete(h.id)}>
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

export default Hospedagens;