import React, { useState, useEffect } from 'react';
import { apiFetch } from './api';
import { useParams, Link } from 'react-router-dom';

export default function ViagemDetails() {
  const { id } = useParams();
  const [viagem, setViagem] = useState(null);
  const [error, setError] = useState(null);
  const [viajanteId, setViajanteId] = useState('');
  const [status, setStatus] = useState('pendente');
  const [valor, setValor] = useState('');

  useEffect(() => {
    apiFetch(`/viagens/${id}/`)
      .then((data) => setViagem(data))
      .catch((e) => setError(e.message));
  }, [id]);

  const addViajante = async () => {
    try {
      await apiFetch(`/viagens/${id}/adicionar_viajante/`, {
        method: 'POST',
        body: JSON.stringify({ viajante_id: viajanteId, status_pagamento: status, valor_total: valor }),
      });
      // refresh viagem
      const data = await apiFetch(`/viagens/${id}/`);
      setViagem(data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="list-page">
      <Link to="/viagens">← voltar</Link>
      <h2>Detalhes da Viagem {id}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {viagem && (
        <div>
          <p><strong>Título:</strong> {viagem.titulo}</p>
          <p><strong>Destino:</strong> {viagem.destino?.cidade}</p>
          <p><strong>Data:</strong> {viagem.data_inicio} até {viagem.data_fim}</p>
          <h3>Viajantes</h3>
          <ul>
            {viagem.viajantes?.map(v => (
              <li key={v.id}>{v.nome_completo} (CPF: {v.cpf})</li>
            ))}
          </ul>
          <div className="create-section">
            <h3>Adicionar viajante</h3>
            <p>Informe ID do viajante, status e valor:</p>
            <input
              placeholder="viajante_id"
              value={viajanteId}
              onChange={(e) => setViajanteId(e.target.value)}
            /><br />
            <input
              placeholder="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            /><br />
            <input
              placeholder="valor_total"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            /><br />
            <button onClick={addViajante}>Adicionar</button>
          </div>
        </div>
      )}
    </div>
  );
}
