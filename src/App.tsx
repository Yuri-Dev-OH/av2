import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Funcionarios from './pages/Funcionarios';
import Aeronaves from './pages/Aeronaves';
import Relatorios from './pages/Relatorios';
import Pecas from './pages/Pecas';
import Etapas from './pages/Etapas';
import Testes from './pages/Testes';
import DevSwitch from './components/DevSwitch';
import { USUARIOS_TESTE } from './constants/usuarios';

export default function App() {
  
  const sessaoAtiva = localStorage.getItem('usuarioSessao');
  // Lê a flag que avisa se o usuário clicou em "Sair" propositalmente
  const pulouAutoLogin = sessionStorage.getItem('skipAutoLogin');

  // Só injeta o login automático se estiver no modo DEV e não tiver acabado de dar Logout
  if (import.meta.env.DEV && !sessaoAtiva && !pulouAutoLogin) {
    localStorage.setItem('usuarioSessao', JSON.stringify(USUARIOS_TESTE[0]));
    window.location.reload();
    return null;
  }

  return (
    <Router>
      <DevSwitch />

      <Routes>
        <Route 
          path="/" 
          element={
            sessaoAtiva || (import.meta.env.DEV && !pulouAutoLogin)
              ? <Navigate to="/dashboard" replace /> 
              : <Login />
          } 
        />
        
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="aeronaves" element={<Aeronaves />} />
          <Route path="pecas" element={<Pecas />} />
          <Route path="etapas" element={<Etapas />} />
          <Route path="testes" element={<Testes />} />
          <Route path="funcionarios" element={<Funcionarios />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}