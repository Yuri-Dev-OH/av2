import React from 'react';
import { 
  IoAirplaneOutline, IoHardwareChipOutline, 
  IoLayersOutline, IoCheckmarkCircleOutline, IoDocumentTextOutline,
  IoTerminalOutline
} from 'react-icons/io5';

export default function Home() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[75vh] flex flex-col justify-center relative">
      
      {/* TÍTULO PRINCIPAL */}
      <div className="text-center max-w-3xl mx-auto mb-12 mt-6">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Bem-vindo ao Aerocode</h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          O sistema oficial para gestão da produção de aeronaves. Siga o fluxo de trabalho abaixo para gerenciar sua frota do zero à entrega.
        </p>
      </div>

      {/* TUTORIAL / FLUXO DE TRABALHO (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10 flex-grow">
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 rounded-full flex items-center justify-center mb-4 transition-colors"><IoAirplaneOutline size={28} /></div>
          <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-1">Passo 1</span>
          <h3 className="font-bold text-slate-800 mb-2">Aeronaves</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Cadastre o chassi base da aeronave. Tudo começa aqui. O código gerado será a raiz de todas as outras vinculações.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 rounded-full flex items-center justify-center mb-4 transition-colors"><IoHardwareChipOutline size={28} /></div>
          <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-1">Passo 2</span>
          <h3 className="font-bold text-slate-800 mb-2">Peças</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Adicione motores, fuselagem e aviônicos. Vincule cada componente diretamente à aeronave que foi cadastrada.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 rounded-full flex items-center justify-center mb-4 transition-colors"><IoLayersOutline size={28} /></div>
          <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-1">Passo 3</span>
          <h3 className="font-bold text-slate-800 mb-2">Etapas</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Crie a linha do tempo de montagem. Avance os status respeitando a ordem obrigatória de produção.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 rounded-full flex items-center justify-center mb-4 transition-colors"><IoCheckmarkCircleOutline size={28} /></div>
          <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-1">Passo 4</span>
          <h3 className="font-bold text-slate-800 mb-2">Testes</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Registre aprovações elétricas, hidráulicas e aerodinâmicas para garantir a certificação e a qualidade do avião.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-600 rounded-full flex items-center justify-center mb-4 transition-colors"><IoDocumentTextOutline size={28} /></div>
          <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase mb-1">Passo Final</span>
          <h3 className="font-bold text-slate-800 mb-2">Relatórios</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Volte para a aba Aeronaves e clique em "Gerar Relatório". O documento unificará tudo para a entrega ao cliente.</p>
        </div>
      </div>

      {/* EXPLICAÇÃO DO DEV SWITCH */}
      <div className="mt-4 mb-4 bg-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-5 shadow-md max-w-5xl mx-auto w-full border border-slate-700">
        <div className="p-3 bg-slate-700 text-blue-400 rounded-xl shrink-0">
          <IoTerminalOutline size={32} />
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-bold text-white mb-2 text-lg tracking-wide">Modo de Desenvolvimento ágil (Dev Switch)</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Para agilizar o desenvolvimento deste protótipo, criamos o <strong>Dev Switch</strong> no canto inferior esquerdo da tela. 
            Use-o para alternar instantaneamente entre os níveis de permissão (<span className="text-red-400">Administrador</span>, <span className="text-yellow-400">Engenheiro</span> ou <span className="text-green-400">Operador</span>). Isso permite testar a renderização condicional, proteções de rotas e o comportamento da interface gráfica sem a necessidade de simular múltiplos logins.
          </p>
        </div>
      </div>

    </div>
  );
}