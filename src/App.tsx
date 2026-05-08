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

export default function App() {
  // Verifica se existe um usuário logado no localStorage
  const sessaoAtiva = localStorage.getItem('usuarioSessao');

  return (
    <Router>
      {/* O DevSwitch continua aqui para você poder trocar de conta rápido DEPOIS de logar */}
      <DevSwitch />

      <Routes>
        {/* Rota Raiz: Se estiver logado, vai pro Dashboard. Se não, Tela de Login */}
        <Route 
          path="/" 
          element={
            sessaoAtiva 
              ? <Navigate to="/dashboard" replace /> 
              : <Login />
          } 
        />
        
        {/* Rotas Protegidas do Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            sessaoAtiva ? <Dashboard /> : <Navigate to="/" replace />
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="aeronaves" element={<Aeronaves />} />
          <Route path="pecas" element={<Pecas />} />
          <Route path="etapas" element={<Etapas />} />
          <Route path="testes" element={<Testes />} />
          <Route path="funcionarios" element={<Funcionarios />} />
        </Route>
        
        {/* Redireciona qualquer rota inexistente para a raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}