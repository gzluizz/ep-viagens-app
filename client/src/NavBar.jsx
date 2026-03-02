import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import logo from './assets/logo_ep.jpg';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <img src={logo} alt="logo" className="nav-logo" />
      {user ? (
        <>
          <div className="nav-links">
            <NavLink to="/viagens">Viagens</NavLink>
            <NavLink to="/destinos">Destinos</NavLink>
            <NavLink to="/hospedagens">Hospedagens</NavLink>
            <NavLink to="/transportes">Transportes</NavLink>
            <NavLink to="/viajantes">Viajantes</NavLink>
          </div>
          <div className="user-info">
            Olá, {user.username} <button onClick={handleLogout}>sair</button>
          </div>
        </>
      ) : (
        <NavLink to="/login">Entrar</NavLink>
      )}
    </nav>
  );
}
