import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function Viajantes() {
  const [viajantes, setViajantes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome_completo: "",
    cpf: "",
    data_nascimento: "",
    celular: "",
    email: "",
    contato_emergencia_nome: "",
    contato_emergencia_telefone: "",
    observacoes_medicas: "",
  });

  useEffect(() => {
    fetchViajantes();
  }, []);

  async function fetchViajantes() {
    try {
      setLoading(true);
      const data = await apiFetch("/viajantes/");
      setViajantes(Array.isArray(data) ? data : data.results || []);
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
        await apiFetch(`/viajantes/${editingId}/`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/viajantes/", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setEditingId(null);
      setForm({
        nome_completo: "",
        cpf: "",
        data_nascimento: "",
        celular: "",
        email: "",
        contato_emergencia_nome: "",
        contato_emergencia_telefone: "",
        observacoes_medicas: "",
      });

      fetchViajantes();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(v) {
    setForm(v);
    setEditingId(v.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir este viajante?")) return;
    await apiFetch(`/viajantes/${id}/`, { method: "DELETE" });
    fetchViajantes();
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <h2>Viajantes</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input name="nome_completo" placeholder="Nome Completo" value={form.nome_completo} onChange={handleChange} required />
          <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required style={{ marginLeft: 10 }} />
          
          <br /><br />

          <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} required />
          <input name="celular" placeholder="Celular" value={form.celular} onChange={handleChange} style={{ marginLeft: 10 }} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ marginLeft: 10 }} />

          <br /><br />

          <input name="contato_emergencia_nome" placeholder="Contato Emergência" value={form.contato_emergencia_nome} onChange={handleChange} />
          <input name="contato_emergencia_telefone" placeholder="Telefone Emergência" value={form.contato_emergencia_telefone} onChange={handleChange} style={{ marginLeft: 10 }} />

          <br /><br />

          <textarea
            name="observacoes_medicas"
            placeholder="Observações Médicas"
            value={form.observacoes_medicas}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%" }}
          />

          <br /><br />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Criar Viajante"}
          </button>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {viajantes.map((v) => (
                <tr key={v.id}>
                  <td>{v.nome_completo}</td>
                  <td>{v.cpf}</td>
                  <td>{v.email}</td>
                  <td>
                    <button onClick={() => handleEdit(v)}>Editar</button>
                    <button onClick={() => handleDelete(v.id)} style={{ marginLeft: 5 }}>
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

export default Viajantes;