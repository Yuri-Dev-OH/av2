import React from 'react';
import { USUARIOS_TESTE } from '../constants/usuarios';
import { IoTerminalOutline } from 'react-icons/io5';

export default function DevSwitch() {
  if (!import.meta.env.DEV) return null;

  const usuarioSessao = localStorage.getItem('usuarioSessao');
  const usuarioAtual = usuarioSessao ? JSON.parse(usuarioSessao) : null;

  const mudarNivel = (email: string) => {
    const novoUsuario = USUARIOS_TESTE.find(u => u.email === email);
    if (novoUsuario) {
      localStorage.setItem('usuarioSessao', JSON.stringify(novoUsuario));
      window.location.reload();
    }
  };

  const getCargoInfo = (nivel: string) => {
    if (nivel === 'Administrador') return { sigla: 'ADM', cor: 'text-red-400' };
    if (nivel === 'Engenheiro') return { sigla: 'ENG', cor: 'text-yellow-400' };
    if (nivel === 'Operador') return { sigla: 'OPE', cor: 'text-green-400' };
    return { sigla: 'DEV', cor: 'text-blue-400' };
  };

  const cargoInfo = getCargoInfo(usuarioAtual?.nivel);

  return (
    // CORREÇÃO AQUI: Trocado hover:w-[410px] por hover:w-[520px] para caberem todos os botões sem espremer
    <div className="fixed bottom-6 left-6 z-[999] group bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl transition-all duration-500 ease-in-out overflow-hidden w-14 hover:w-[520px] h-14 flex items-center cursor-pointer">
      
      <div className="absolute w-14 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
        <span className={`font-black tracking-widest ${cargoInfo.cor}`}>
          {cargoInfo.sigla}
        </span>
      </div>
      
      <div className="flex items-center gap-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 whitespace-nowrap w-full">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-700 shrink-0">
          <IoTerminalOutline className="text-blue-400" size={24} />
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dev Mode</span>
        </div>
        
        <div className="flex flex-row gap-2 shrink-0">
          {USUARIOS_TESTE.map((u) => {
            const isActive = usuarioAtual?.email === u.email;
            return (
              <button
                key={u.id}
                onClick={() => mudarNivel(u.email)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {u.nivel}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}