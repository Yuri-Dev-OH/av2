import React, { useState } from 'react';
import { 
  IoDocumentTextOutline, IoCloseOutline, IoBusinessOutline, 
  IoCalendarOutline, IoTimeOutline, IoAirplaneOutline,
  IoHardwareChipOutline, IoLayersOutline, IoCheckmarkCircleOutline,
  IoEyeOutline, IoDownloadOutline, IoPrintOutline
} from 'react-icons/io5';

// --- TIPAGENS ATUALIZADAS PARA O RELATÓRIO ---
interface PecaMock { 
  nome: string; 
  tipo: 'NACIONAL' | 'IMPORTADA';
  fornecedor: string;
  status: 'EM_PRODUCAO' | 'EM_TRANSPORTE' | 'PRONTA'; 
}
interface EtapaMock { 
  nome: string; 
  prazo: string;
  status: 'PENDENTE' | 'ANDAMENTO' | 'CONCLUIDA'; 
}
interface TesteMock { 
  tipo: 'ELETRICO' | 'HIDRAULICO' | 'AERODINAMICO'; 
  resultado: 'APROVADO' | 'REPROVADO'; 
}

interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: 'COMERCIAL' | 'MILITAR';
  capacidade: number;
  alcance: number;
  pecas: PecaMock[];
  etapas: EtapaMock[];
  testes: TesteMock[];
}

interface Relatorio {
  id: string; // Sequencial por aeronave (ex: "1", "2")
  cliente: string;
  dataEntrega: string;
  dataCriacao: string;
  aeronave: Aeronave;
}

// --- DADOS MOCKADOS ---
const MOCK_RELATORIOS: Relatorio[] = [
  {
    id: '1',
    cliente: 'Força Aérea Brasileira',
    dataEntrega: '15/12/2026',
    dataCriacao: '06/05/2026',
    aeronave: {
      codigo: 'EMB-314',
      modelo: 'Super Tucano',
      tipo: 'MILITAR',
      capacidade: 2,
      alcance: 1330,
      pecas: [
        { nome: 'Motor Pratt & Whitney', tipo: 'IMPORTADA', fornecedor: 'P&W', status: 'PRONTA' },
        { nome: 'Fuselagem Central', tipo: 'NACIONAL', fornecedor: 'Embraer SJC', status: 'EM_PRODUCAO' }
      ],
      etapas: [
        { nome: 'Montagem Estrutural', prazo: '2026-05-10', status: 'CONCLUIDA' },
        { nome: 'Pintura e Acabamento', prazo: '2026-06-20', status: 'ANDAMENTO' }
      ],
      testes: [
        { tipo: 'ELETRICO', resultado: 'APROVADO' },
        { tipo: 'AERODINAMICO', resultado: 'APROVADO' }
      ]
    }
  },
  {
    id: '1',
    cliente: 'Azul Linhas Aéreas',
    dataEntrega: '10/08/2026',
    dataCriacao: '05/05/2026',
    aeronave: {
      codigo: 'EMB-190',
      modelo: 'E-Jet E2',
      tipo: 'COMERCIAL',
      capacidade: 114,
      alcance: 5278,
      pecas: [
        { nome: 'Asas Principais', tipo: 'NACIONAL', fornecedor: 'Embraer SJC', status: 'PRONTA' },
        { nome: 'Aviônicos', tipo: 'IMPORTADA', fornecedor: 'Honeywell', status: 'EM_TRANSPORTE' }
      ],
      etapas: [
        { nome: 'Integração de Sistemas', prazo: '2026-07-01', status: 'PENDENTE' }
      ],
      testes: [
        { tipo: 'HIDRAULICO', resultado: 'APROVADO' }
      ]
    }
  }
];

export default function Relatorios() {
  const [relatorios] = useState<Relatorio[]>(MOCK_RELATORIOS);
  
  // Estados para Modal de Detalhes
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<Relatorio | null>(null);
  
  // Estados para o Visualizador de PDF/Doc
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // --- GERADOR DO TEXTO DO RELATÓRIO ---
  const gerarTextoRelatorio = (relatorio: Relatorio) => {
    return `=======================================
       RELATORIO FINAL DE ENTREGA       
=======================================
Cliente: ${relatorio.cliente}
Data de Entrega: ${relatorio.dataEntrega}

--- DADOS DA AERONAVE ---
Codigo: ${relatorio.aeronave.codigo}
Modelo: ${relatorio.aeronave.modelo}
Tipo: ${relatorio.aeronave.tipo}
Capacidade: ${relatorio.aeronave.capacidade} passageiros
Alcance: ${relatorio.aeronave.alcance} km

--- PECAS UTILIZADAS ---
${relatorio.aeronave.pecas.map(p => `- ${p.nome} (Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor}) - Status: ${p.status}`).join('\n')}

--- ETAPAS REALIZADAS ---
${relatorio.aeronave.etapas.map(e => `- ${e.nome} (Prazo: ${e.prazo}) - Status: ${e.status}`).join('\n')}

--- RESULTADOS DOS TESTES ---
${relatorio.aeronave.testes.map(t => `- Teste ${t.tipo}: ${t.resultado}`).join('\n')}
=======================================`;
  };

  // --- DOWNLOAD DO ARQUIVO ---
  const baixarRelatorio = (relatorio: Relatorio) => {
    const texto = gerarTextoRelatorio(relatorio);
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_${relatorio.aeronave.codigo}_#${relatorio.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- IMPRIMIR / SALVAR COMO PDF NATIVO ---
  const imprimirRelatorio = () => {
    window.print();
  };

  // --- AUXILIARES DE CORES ---
  const getCorPeca = (s: string) => {
    if (s === 'PRONTA') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s === 'EM_TRANSPORTE') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const getCorEtapa = (status: string) => {
    switch(status) {
      case 'CONCLUIDA': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ANDAMENTO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDENTE': return 'bg-slate-200 text-slate-600 border-slate-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCorTeste = (resultado: string) => {
    return resultado === 'APROVADO' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh]">
      
      {/* HEADER DA TELA */}
      {/* Adicionei a classe "print:hidden" em elementos que não devem aparecer se o usuário mandar Imprimir/Salvar PDF */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Relatórios de Entrega</h1>
          <p className="text-slate-500 mt-1">Consulte o histórico e a documentação das aeronaves finalizadas</p>
        </div>
      </div>

      {/* GRID DE CARDS DE RELATÓRIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
        {relatorios.map((relatorio, index) => (
          <div 
            key={index} 
            onClick={() => setRelatorioSelecionado(relatorio)}
            className="group border border-slate-200 rounded-xl p-5 bg-white hover:bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <IoDocumentTextOutline size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Documento de Entrega</span>
                <h2 className="font-black text-slate-800 text-lg uppercase">
                  {relatorio.aeronave.codigo} <span className="text-blue-500">#{relatorio.id}</span>
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <IoBusinessOutline className="text-slate-400" size={16} />
                <span className="truncate"><strong>Cliente:</strong> {relatorio.cliente}</span>
              </div>
              <div className="flex items-center gap-2">
                <IoCalendarOutline className="text-slate-400" size={16} />
                <span><strong>Entrega:</strong> {relatorio.dataEntrega}</span>
              </div>
              <div className="flex items-center gap-2">
                <IoTimeOutline className="text-slate-400" size={16} />
                <span><strong>Criado em:</strong> {relatorio.dataCriacao}</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Abrir Painel →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          MODAL DE DETALHES DO RELATÓRIO
      ========================================= */}
      {relatorioSelecionado && !isViewerOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <IoDocumentTextOutline size={24} className="text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-slate-800 uppercase">
                    {relatorioSelecionado.aeronave.codigo} <span className="text-blue-500">#{relatorioSelecionado.id}</span>
                  </h2>
                </div>
              </div>
              <button onClick={() => setRelatorioSelecionado(null)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 border border-slate-200 p-1.5 rounded-full transition-colors">
                <IoCloseOutline size={22} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-white">
              
              {/* O NOVO BOTÃO DE VER DOCUMENTO LOGO NO TOPO */}
              <button 
                onClick={() => setIsViewerOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              >
                <IoEyeOutline size={22} />
                Ver Documento do Relatório (PDF / TXT)
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Cliente de Destino</span>
                  <span className="font-medium text-slate-800 truncate">{relatorioSelecionado.cliente}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Data de Entrega</span>
                  <span className="font-medium text-slate-800">{relatorioSelecionado.dataEntrega}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Data de Criação</span>
                  <span className="font-medium text-slate-800">{relatorioSelecionado.dataCriacao}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-900 uppercase flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <IoAirplaneOutline size={18}/> Especificações Técnicas
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Modelo</span>
                    <span className="text-sm font-bold text-slate-700">{relatorioSelecionado.aeronave.modelo}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tipo</span>
                    <span className="text-sm font-bold text-slate-700">{relatorioSelecionado.aeronave.tipo}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Capacidade</span>
                    <span className="text-sm font-bold text-slate-700">{relatorioSelecionado.aeronave.capacidade} pass.</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Alcance</span>
                    <span className="text-sm font-bold text-slate-700">{relatorioSelecionado.aeronave.alcance} km</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-5">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                        <IoHardwareChipOutline size={14}/> Relação de Peças
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {relatorioSelecionado.aeronave.pecas.map((p, i) => (
                          <li key={i} className="text-xs text-slate-600 flex flex-col bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold truncate">{p.nome}</span>
                              <span className={`font-mono font-bold text-[9px] border px-1.5 py-0.5 rounded ${getCorPeca(p.status)}`}>{p.status.replace('_', ' ')}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{p.fornecedor} | {p.tipo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                        <IoLayersOutline size={14}/> Histórico de Etapas
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {relatorioSelecionado.aeronave.etapas.map((e, i) => (
                          <li key={i} className="text-xs text-slate-600 flex flex-col bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold truncate">{e.nome}</span>
                              <span className={`font-mono font-bold text-[9px] border px-1.5 py-0.5 rounded ${getCorEtapa(e.status)}`}>{e.status}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Prazo: {e.prazo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                      <IoCheckmarkCircleOutline size={14}/> Certificação de Testes
                    </span>
                    <ul className="flex flex-col gap-1.5">
                      {relatorioSelecionado.aeronave.testes.map((t, i) => (
                        <li key={i} className="text-xs text-slate-600 flex justify-between items-center bg-slate-50 px-2 py-1.5 rounded border border-slate-100">
                          <span className="truncate mr-2 font-medium">Teste {t.tipo}</span>
                          <span className={`font-mono font-bold text-[9px] border px-1.5 py-0.5 rounded ${getCorTeste(t.resultado)}`}>{t.resultado}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
               <button onClick={() => setRelatorioSelecionado(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors">
                 Fechar Detalhes
               </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: VISUALIZADOR DE DOCUMENTO (PDF/TXT)
      ========================================= */}
      {isViewerOpen && relatorioSelecionado && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex flex-col">
          
          {/* Toolbar Superior do Visualizador (Oculto na impressão) */}
          <div className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-lg print:hidden">
            <div className="flex items-center gap-3">
              <IoDocumentTextOutline size={24} className="text-blue-400" />
              <span className="font-mono text-sm tracking-wider">
                Relatorio_{relatorioSelecionado.aeronave.codigo}_#{relatorioSelecionado.id}.txt
              </span>
            </div>
            
            <div className="flex gap-3">
              {/* Botão de Imprimir/PDF Nativo */}
              <button 
                onClick={imprimirRelatorio}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition-colors"
              >
                <IoPrintOutline size={18} /> Salvar PDF / Imprimir
              </button>

              {/* Botão de Download TXT */}
              <button 
                onClick={() => baixarRelatorio(relatorioSelecionado)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors"
              >
                <IoDownloadOutline size={18} /> Baixar Relatório
              </button>
              
              {/* Botão Fechar Viewer */}
              <button 
                onClick={() => setIsViewerOpen(false)}
                className="ml-4 p-2 bg-slate-700 hover:bg-red-500 rounded-full transition-colors"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>
          </div>

          {/* Área Central: A Folha A4 */}
          <div className="flex-grow overflow-y-auto p-8 flex justify-center print:p-0 print:overflow-visible">
            
            {/* O Documento em si. Note a formatação <pre> para manter os espaços exatos */}
            <div className="bg-white w-full max-w-[800px] min-h-[1000px] shadow-2xl p-12 text-black font-mono text-sm print:shadow-none print:w-full print:p-0">
              <pre className="whitespace-pre-wrap leading-relaxed">
{gerarTextoRelatorio(relatorioSelecionado)}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}