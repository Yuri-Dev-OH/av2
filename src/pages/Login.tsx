import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAirplaneOutline, IoLockClosedOutline, IoPersonOutline, IoWarningOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { USUARIOS_TESTE } from '../constants/usuarios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const usuarioEncontrado = USUARIOS_TESTE.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      localStorage.setItem('usuarioSessao', JSON.stringify(usuarioEncontrado));
      sessionStorage.removeItem('skipAutoLogin');
      window.location.href = '/dashboard';
    } else {
      setErro('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* LOGO E TÍTULO (Agora fora do Grid das colunas, isolado no topo) */}
      <div className="text-center flex flex-col items-center gap-2 mb-10 z-10">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
          <IoAirplaneOutline size={36} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mt-2">AEROCODE</h1>
        <p className="text-slate-500 font-medium">Gestão de Produção de Aeronaves</p>
      </div>

      {/* Container principal com o Grid focado apenas nos Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center z-10">
        
        {/* COLUNA ESQUERDA: Dica do Dev Switch */}
        <div className="hidden lg:flex flex-col items-end text-right justify-center">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 shadow-sm w-full max-w-[320px]">
            <div className="flex justify-end mb-3">
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">Atalho Rápido</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Para agilizar seus testes, você não precisa digitar as credenciais. Basta usar o <strong>Dev Switch</strong> no canto inferior esquerdo da tela e clicar no cargo desejado para logar instantaneamente!
            </p>
          </div>
        </div>

        {/* COLUNA CENTRAL: Formulário de Login */}
        <div className="w-full max-w-[420px] mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Acesso ao Sistema</h2>
            <p className="text-sm text-slate-500 mt-1">Insira suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 tracking-tight">E-mail Corporativo</label>
              <div className="relative">
                <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: admin@aerocode.com" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 tracking-tight">Senha de Acesso</label>
              <div className="relative">
                <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg flex items-center gap-2 border border-red-100 animate-[pulse_0.3s_ease-in-out]">
                <IoWarningOutline size={18} className="shrink-0" />
                {erro}
              </div>
            )}

            <button 
              type="submit" 
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Entrar no Sistema
            </button>
          </form>
          
          {/* Dica mobile */}
          <div className="lg:hidden mt-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-xs text-slate-600">Dica: Use o botão <strong>DEV</strong> no canto esquerdo para atalho rápido de login.</p>
          </div>
        </div>

        {/* COLUNA DIREITA: Credenciais de Teste */}
        <div className="hidden lg:flex flex-col items-start justify-center">
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm w-full max-w-[320px]">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
              <IoInformationCircleOutline size={18} className="text-blue-500" /> Teste de Validação
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Para validar o fluxo de erro, digite dados incorretos. Para sucesso, use os e-mails abaixo com a senha padrão: <strong className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">123</strong>
            </p>
            
            <ul className="flex flex-col gap-3 font-mono text-xs">
              <li className="flex flex-col bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                <span className="font-bold text-red-500 mb-0.5">ADMINISTRADOR</span> 
                <span className="text-slate-600">admin@aerocode.com</span>
              </li>
              <li className="flex flex-col bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                <span className="font-bold text-yellow-500 mb-0.5">ENGENHEIRO</span> 
                <span className="text-slate-600">engenheiro@aerocode.com</span>
              </li>
              <li className="flex flex-col bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                <span className="font-bold text-green-500 mb-0.5">OPERADOR</span> 
                <span className="text-slate-600">operador@aerocode.com</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}