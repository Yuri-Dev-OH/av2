import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  IoHomeOutline, IoAirplaneOutline, IoHardwareChipOutline, 
  IoLayersOutline, IoBuildOutline, IoPeopleOutline, IoDocumentTextOutline,
  IoLogOutOutline
} from 'react-icons/io5';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const usuarioSessao = localStorage.getItem('usuarioSessao');
  const usuario = usuarioSessao ? JSON.parse(usuarioSessao) : null;
  
  const nivel = usuario?.nivel;
  const isAdmin = nivel === 'Administrador';
  const isEngenheiro = nivel === 'Engenheiro';
  const isOperador = nivel === 'Operador';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.setItem('skipAutoLogin', 'true');
    localStorage.removeItem('usuarioSessao');
    window.location.href = '/'; 
  };

  const navLinks = [
    { name: 'Home', path: '/dashboard/home', icon: <IoHomeOutline size={20} /> },
  ];

  if (isAdmin || isEngenheiro) {
    navLinks.push({ name: 'Relatórios', path: '/dashboard/relatorios', icon: <IoDocumentTextOutline size={20} /> });
  }

  navLinks.push({ name: 'Aeronaves', path: '/dashboard/aeronaves', icon: <IoAirplaneOutline size={20} /> });
  navLinks.push({ name: 'Peças', path: '/dashboard/pecas', icon: <IoHardwareChipOutline size={20} /> });

  if (isAdmin || isOperador) {
    navLinks.push({ name: 'Etapas', path: '/dashboard/etapas', icon: <IoLayersOutline size={20} /> });
  }

  if (isAdmin || isEngenheiro) {
    navLinks.push({ name: 'Testes', path: '/dashboard/testes', icon: <IoBuildOutline size={20} /> });
  }

  if (isAdmin) {
    navLinks.push({ name: 'Funcionários', path: '/dashboard/funcionarios', icon: <IoPeopleOutline size={20} /> });
  }

  return (
    <>
      <nav className={`fixed left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-md rounded-2xl z-50 transition-all duration-500 ease-in-out flex justify-center ${
        isScrolled ? 'top-3 py-2 px-3 w-auto' : 'top-4 w-[95%] max-w-6xl py-3 px-6'
      }`}>
        <div className="flex items-center justify-between gap-6 w-full">
          
          <div className={`text-blue-900 font-bold tracking-wide transition-all duration-500 overflow-hidden whitespace-nowrap flex items-center ${
            isScrolled ? 'max-w-0 opacity-0 mr-0 text-[0px]' : 'max-w-[200px] opacity-100 mr-2 text-xl'
          }`}>
            AEROCODE
          </div>

          <ul className="flex flex-row gap-1 items-center justify-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.path} className="group/nav">
                  {({ isActive }) => (
                    <div className={`flex items-center rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${
                      isActive ? 'bg-blue-100 text-blue-700 px-3 py-2 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600 p-2'
                    }`}>
                      <div className="min-w-max flex items-center justify-center">{link.icon}</div>
                      <span className={`whitespace-nowrap font-medium text-sm transition-all duration-300 ease-in-out ${
                        isScrolled && !isActive 
                          ? 'max-w-0 opacity-0 ml-0 group-hover/nav:max-w-[120px] group-hover/nav:opacity-100 group-hover/nav:ml-2' 
                          : 'max-w-[120px] opacity-100 ml-2'
                      }`}>{link.name}</span>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={`flex items-center gap-3 transition-all duration-500 overflow-hidden ${
            isScrolled ? 'max-w-0 opacity-0 ml-0 border-none' : 'max-w-[250px] opacity-100 ml-2 border-l border-slate-200 pl-4'
          }`}>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Logado como</span>
              <span className="text-sm font-bold text-blue-900 leading-none truncate max-w-[100px]">{usuario?.user || usuario?.nome}</span>
            </div>
            <button onClick={() => setIsLogoutModalOpen(true)} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors" title="Sair do Sistema">
              <IoLogOutOutline size={20} />
            </button>
          </div>

        </div>
      </nav>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-[scaleIn_0.2s_ease-out]">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoLogOutOutline size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Sair do Sistema?</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">Tem certeza que deseja encerrar a sua sessão e voltar para a tela de login?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-5 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors w-full">Cancelar</button>
              <button onClick={handleLogout} className="px-5 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-bold shadow-sm transition-all w-full">Sim, Sair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

//https://www.pichau.com.br/placa-de-video-asus-geforce-rtx-5090-tuf-gaming-oc-32gb-gddr7-512-bit-tuf-rtx5090-o32g-gaming-nac?srsltid=AfmBOoqCG4UP5sRVCer-Oh04neJxq59FWF6irqzO86hhvuQff0ykCJa9SAI