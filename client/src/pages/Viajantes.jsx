import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function Viajantes() {
  const [viajantes, setViajantes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedViajante, setSelectedViajante] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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
    setForm({
      nome_completo: v.nome_completo,
      cpf: v.cpf,
      data_nascimento: v.data_nascimento,
      celular: v.celular,
      email: v.email,
      contato_emergencia_nome: v.contato_emergencia_nome,
      contato_emergencia_telefone: v.contato_emergencia_telefone,
      observacoes_medicas: v.observacoes_medicas,
    });
    setEditingId(v.id);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      await apiFetch(`/viajantes/${deleteId}/`, { method: "DELETE" });
      setDeleteId(null);
      fetchViajantes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleView(id) {
    try {
      const data = await apiFetch(`/viajantes/${id}/`);
      setSelectedViajante(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="layout" style={{ display: "flex" }}>
      <Sidebar />

      <div className="content">
        <h2>Viajantes</h2>

        <form onSubmit={handleSubmit} className="form-viajante">
          <input name="nome_completo" placeholder="Nome Completo" value={form.nome_completo} onChange={handleChange} required />
          <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />

          <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} required />
          <input name="celular" placeholder="Celular" value={form.celular} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

          <input name="contato_emergencia_nome" placeholder="Contato Emergência" value={form.contato_emergencia_nome} onChange={handleChange} />
          <input name="contato_emergencia_telefone" placeholder="Telefone Emergência" value={form.contato_emergencia_telefone} onChange={handleChange} />

          <textarea
            name="observacoes_medicas"
            placeholder="Observações Médicas"
            value={form.observacoes_medicas}
            onChange={handleChange}
            rows="3"
          />

          <button type="submit">
            {editingId ? "Salvar Alterações" : "Criar Viajante"}
          </button>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Data Nascimento</th>
                <th>Contato</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {viajantes.map((v) => (
                <tr key={v.id}>
                  <td>{v.nome_completo}</td>
                  <td>{v.cpf}</td>
                  <td>{v.data_nascimento}</td>
                  <td>{v.celular}</td>
                  <td>{v.email}</td>
                  <td>
                    <button onClick={() => handleView(v.id)}>Visualizar</button>
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

        {/* Modal Visualização */}
        {selectedViajante && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Detalhes do Viajante</h3>
              <p><strong>Nome:</strong> {selectedViajante.nome_completo}</p>
              <p><strong>CPF:</strong> {selectedViajante.cpf}</p>
              <p><strong>Nascimento:</strong> {selectedViajante.data_nascimento}</p>
              <p><strong>Celular:</strong> {selectedViajante.celular}</p>
              <p><strong>Email:</strong> {selectedViajante.email}</p>
              <p><strong>Contato Emergência:</strong> {selectedViajante.contato_emergencia_nome} - {selectedViajante.contato_emergencia_telefone}</p>
              <p><strong>Observações:</strong> {selectedViajante.observacoes_medicas || "Nenhuma"}</p>

              <button onClick={() => setSelectedViajante(null)}>
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Modal Confirmação Exclusão */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este viajante?</p>

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

export default Viajantes;