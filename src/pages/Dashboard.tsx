import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [usuario, setUsuario] = useState<any>(null);
  const navigate = useNavigate();

  // Verifica se o usuário está logado quando o Dashboard carregar
  useEffect(() => {
    const usuarioLogado = localStorage.getItem('usuarioSessao');
    if (!usuarioLogado) {
      // Se tentar acessar o dashboard sem logar, é chutado pro login
      navigate('/');
    } else {
      setUsuario(JSON.parse(usuarioLogado));
    }
  }, [navigate]);

  if (!usuario) return null; // Previne renderização antes da verificação

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Componente da Navbar Flutuante */}
      <Navbar />

      {/* A tag <main> é onde o conteúdo das sub-rotas (Home, Aeronaves, etc.) vai aparecer.
        A margem pt-28 garante que o conteúdo não fique escondido atrás da Navbar flutuante.
      */}
      <main className="pt-28 pb-10 px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}