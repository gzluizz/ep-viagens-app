import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from './api';

export default function ListPage({ resource, title }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/${resource}/`)
      .then((data) => setItems(data))
      .catch((e) => setError(e.message));
  }, [resource]);

  const [newItem, setNewItem] = useState('{}');
  const [createError, setCreateError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editJson, setEditJson] = useState('{}');
  const [editError, setEditError] = useState(null);

  const handleCreate = async () => {
    setCreateError(null);
    try {
      const parsed = JSON.parse(newItem);
      await apiFetch(`/${resource}/`, {
        method: 'POST',
        body: JSON.stringify(parsed),
      });
      // reload list
      const data = await apiFetch(`/${resource}/`);
      setItems(data);
      setNewItem('{}');
    } catch (e) {
      setCreateError(e.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditJson(JSON.stringify(item, null, 2));
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditJson('{}');
    setEditError(null);
  };

  const saveEdit = async () => {
    setEditError(null);
    try {
      const parsed = JSON.parse(editJson);
      await apiFetch(`/${resource}/${editingId}/`, {
        method: 'PUT',
        body: JSON.stringify(parsed),
      });
      const data = await apiFetch(`/${resource}/`);
      setItems(data);
      cancelEdit();
    } catch (e) {
      setEditError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    await apiFetch(`/${resource}/${id}/`, { method: 'DELETE' });
    const data = await apiFetch(`/${resource}/`);
    setItems(data);
  };

  return (
    <div className="list-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>{title}</h2>
        <button onClick={() => {
            apiFetch(`/${resource}/`).then(setItems).catch((e) => setError(e.message));
          }}
          style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
        >
          Atualizar
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {(Array.isArray(items) ? items : []).map((i) => (
          <li key={i.id}>
            <span>
              {resource === 'viagens' ? (
                <a href={`/viagens/${i.id}`}>{i.titulo || i.nome || i.title || i.username || JSON.stringify(i)}</a>
              ) : (
                i.nome || i.title || i.username || JSON.stringify(i)
              )}
            </span>
            <span>
              <button className="edit" onClick={() => startEdit(i)}>
                editar
              </button>
              <button className="delete" onClick={() => handleDelete(i.id)}>
                excluir
              </button>
            </span>
          </li>
        ))}
      </ul>

      {editingId && (
        <div className="create-section">
          <h3>Editando item #{editingId}</h3>
          {editError && <p style={{ color: 'red' }}>{editError}</p>}
          <textarea
            rows="6"
            cols="50"
            value={editJson}
            onChange={(e) => setEditJson(e.target.value)}
          />
          <br />
          <button onClick={saveEdit}>Salvar</button>
          <button onClick={cancelEdit} style={{ marginLeft: '0.5rem' }}>
            cancelar
          </button>
        </div>
      )}

      <div className="create-section">
        <h3>Adicionar novo item</h3>
        {createError && <p style={{ color: 'red' }}>{createError}</p>}
        <textarea
          rows="4"
          cols="50"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <br />
        <button onClick={handleCreate}>Criar</button>
      </div>
    </div>
  );
}
