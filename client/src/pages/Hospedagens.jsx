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
    destino: "",
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
      ...form,
      destino: Number(form.destino),
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
      destino: "",
    });

    fetchHospedagens();
  }

  function handleEdit(h) {
    setForm({
      nome: h.nome,
      endereco: h.endereco,
      telefone: h.telefone,
      email: h.email,
      destino: h.destino, // id do destino
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
      <Sidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <h2>Hospedagens</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
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
            style={{ marginLeft: 10 }}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ marginLeft: 10 }}
          />

          <br /><br />

          <input
            name="endereco"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />

          <br /><br />

          {/* SELECT DE DESTINO */}
          <select
            name="destino"
            value={form.destino}
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

          <br /><br />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Criar Hospedagem"}
          </button>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table border="1" cellPadding="5">
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
                    {h.destino_detalhe
                      ? `${h.destino_detalhe.cidade} - ${h.destino_detalhe.estado}`
                      : h.destino}
                  </td>
                  <td>{h.telefone}</td>
                  <td>{h.email}</td>
                  <td>
                    <button onClick={() => handleEdit(h)}>Editar</button>
                    <button
                      onClick={() => handleDelete(h.id)}
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

export default Hospedagens;