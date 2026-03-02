import React, { useState, useEffect } from 'react';
import { apiFetch } from './api';

export default function Viagens() {
  const [viagens, setViagens] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/viagens/')
      .then((data) => setViagens(data))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="viagens-page">
      <h2>Viagens</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {viagens.map((v) => (
          <li key={v.id}>{v.nome || v.title || JSON.stringify(v)}</li>
        ))}
      </ul>
    </div>
  );
}
