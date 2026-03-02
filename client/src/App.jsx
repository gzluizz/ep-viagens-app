import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import Login from './Login';
import ListPage from './ListPage';
import NavBar from './NavBar';
import ViagemDetails from './ViagemDetails';
import './App.css';

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="main-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/viagens"
              element={
                <PrivateRoute>
                  <ListPage resource="viagens" title="Viagens" />
                </PrivateRoute>
              }
            />
            <Route
              path="/destinos"
              element={
                <PrivateRoute>
                  <ListPage resource="destinos" title="Destinos" />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospedagens"
              element={
                <PrivateRoute>
                  <ListPage resource="hospedagens" title="Hospedagens" />
                </PrivateRoute>
              }
            />
            <Route
              path="/transportes"
              element={
                <PrivateRoute>
                  <ListPage resource="transportes" title="Transportes" />
                </PrivateRoute>
              }
            />
            <Route
              path="/viajantes"
              element={
                <PrivateRoute>
                  <ListPage resource="viajantes" title="Viajantes" />
                </PrivateRoute>
              }
            />
            <Route
              path="/viagens/:id"
              element={
                <PrivateRoute>
                  <ViagemDetails />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/viagens" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
