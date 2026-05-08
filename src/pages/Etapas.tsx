import React, { useState } from 'react';
import { 
  IoAddOutline, IoCloseOutline, IoLayersOutline, 
  IoAirplaneOutline, IoArrowBackOutline, IoCheckmarkCircleOutline,
  IoTimeOutline, IoPlayForwardOutline, IoSearchOutline,
  IoPersonOutline, IoPeopleOutline, IoPencilOutline
} from 'react-icons/io5';

// --- TIPAGENS ---
interface AeronaveResumo { id: string; codigo: string; modelo: string; }
interface Etapa { 
  id: string; 
  aeronaveId: string; 
  nome: string; 
  prazo: string; 
  status: 'PENDENTE' | 'ANDAMENTO' | 'CONCLUIDA';
  funcionarios: string[]; 
}

// --- DADOS MOCKADOS ---
const MOCK_AERONAVES: AeronaveResumo[] = [
  { id: 'a1', codigo: 'EMB-314', modelo: 'Super Tucano' },
  { id: 'a2', codigo: 'EMB-190', modelo: 'E-Jet E2' },
  { id: 'a3', codigo: 'KC-390', modelo: 'Millennium' }
];

const MOCK_FUNCIONARIOS = [
  'Yuri Gonçalves', 'Hugo Perestrelo', 'Guilherme Fernando', 
  'Felipe Gomes', 'João Cavalcante', 'Altier Romão'
];

const MOCK_ETAPAS: Etapa[] = [
  { id: 'e1', aeronaveId: 'a1', nome: 'Design e Validação', prazo: '2026-01-15', status: 'CONCLUIDA', funcionarios: ['Yuri Gonçalves', 'Hugo Perestrelo'] },
  { id: 'e2', aeronaveId: 'a1', nome: 'Montagem da Fuselagem Central', prazo: '2026-03-20', status: 'ANDAMENTO', funcionarios: ['Guilherme Fernando', 'Felipe Gomes'] },
  { id: 'e3', aeronaveId: 'a1', nome: 'Instalação dos Aviônicos', prazo: '2026-05-10', status: 'PENDENTE', funcionarios: ['João Cavalcante'] },
  { id: 'e4', aeronaveId: 'a2', nome: 'Integração de Sistemas', prazo: '2026-07-01', status: 'PENDENTE', funcionarios: ['Altier Romão', 'Yuri Gonçalves'] }
];

export default function Etapas() {
  // Controle de Permissões baseado na Sessão
  const sessao = localStorage.getItem('usuarioSessao');
  const usuario = sessao ? JSON.parse(sessao) : null;
  const isAdmin = usuario?.nivel === 'Administrador';
  const isOperador = usuario?.nivel === 'Operador';
  const podeEditarEquipe = isAdmin || isOperador;
  
  // Estados Principais
  const [aeronaves] = useState<AeronaveResumo[]>(MOCK_AERONAVES);
  const [etapas, setEtapas] = useState<Etapa[]>(MOCK_ETAPAS);
  
  const [filtroBusca, setFiltroBusca] = useState('');
  const [aeronaveSelecionada, setAeronaveSelecionada] = useState<AeronaveResumo | null>(null);

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [etapaEditando, setEtapaEditando] = useState<Etapa | null>(null);

  const [formData, setFormData] = useState<Partial<Etapa>>({});
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<string[]>([]);
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const etapasAtuais = aeronaveSelecionada ? etapas.filter(e => e.aeronaveId === aeronaveSelecionada.id) : [];

  // --- REGRAS DE NEGÓCIO ---
  const checarPodeConcluir = (indexAlvo: number) => {
    for (let i = 0; i < indexAlvo; i++) {
      if (etapasAtuais[i].status !== 'CONCLUIDA') return false;
    }
    return true;
  };

  const handleStatusChange = (etapaId: string, novoStatus: string) => {
    const index = etapasAtuais.findIndex(e => e.id === etapaId);
    if (novoStatus === 'CONCLUIDA' && !checarPodeConcluir(index)) {
      alert("Ação bloqueada!\nVocê não pode finalizar esta etapa pois existem etapas anteriores que ainda não foram concluídas.");
      return;
    }
    const listaAtualizada = etapas.map(e => e.id === etapaId ? { ...e, status: novoStatus as any } : e);
    setEtapas(listaAtualizada);
  };

  const toggleFuncionario = (nome: string) => {
    setFuncionariosSelecionados(prev => 
      prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]
    );
  };

  // --- CONTROLE DE CRIAÇÃO ---
  const abrirModalNovo = () => {
    setFormData({ nome: '', prazo: '' });
    setFuncionariosSelecionados([]);
    setIsModalOpen(true);
  };

  const handleSalvarNovaEtapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aeronaveSelecionada) return;

    if (funcionariosSelecionados.length === 0) {
      alert("Operação inválida: É obrigatório alocar pelo menos 1 funcionário para iniciar a etapa.");
      return;
    }

    const novaEtapa: Etapa = {
      id: `e${Date.now()}`,
      aeronaveId: aeronaveSelecionada.id,
      nome: formData.nome!,
      prazo: formData.prazo!,
      status: 'PENDENTE',
      funcionarios: funcionariosSelecionados
    };

    setEtapas([...etapas, novaEtapa]);
    setIsModalOpen(false);
    
    setSuccessMessage(`A etapa "${novaEtapa.nome}" foi criada com a equipe designada!`);
    setIsSuccessModalOpen(true);
  };

  // --- CONTROLE DE EDIÇÃO DE EQUIPE ---
  const abrirModalEditarEquipe = (etapa: Etapa) => {
    setEtapaEditando(etapa);
    setFuncionariosSelecionados(etapa.funcionarios);
    setIsEditModalOpen(true);
  };

  const handleSalvarEdicaoEquipe = (e: React.FormEvent) => {
    e.preventDefault();

    if (funcionariosSelecionados.length === 0) {
      alert("Operação inválida: A etapa deve ter no mínimo 1 funcionário alocado.");
      return;
    }

    const listaAtualizada = etapas.map(etapa => 
      etapa.id === etapaEditando?.id 
        ? { ...etapa, funcionarios: funcionariosSelecionados } 
        : etapa
    );

    setEtapas(listaAtualizada);
    setIsEditModalOpen(false);
    
    setSuccessMessage(`A equipe da etapa "${etapaEditando?.nome}" foi atualizada com sucesso!`);
    setIsSuccessModalOpen(true);
  };

  // --- AUXILIARES VISUAIS ---
  const formatarData = (dataIso: string) => {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}-${mes}-${ano}`;
  };

  const getEstiloStatus = (status: string) => {
    switch(status) {
      case 'CONCLUIDA': return { cor: 'bg-emerald-500 text-white', border: 'border-emerald-500 bg-emerald-50 text-emerald-700', icon: <IoCheckmarkCircleOutline size={20} /> };
      case 'ANDAMENTO': return { cor: 'bg-blue-500 text-white', border: 'border-blue-500 bg-blue-50 text-blue-700', icon: <IoPlayForwardOutline size={20} /> };
      default: return { cor: 'bg-slate-300 text-slate-600', border: 'border-slate-300 bg-slate-50 text-slate-600', icon: <IoTimeOutline size={20} /> };
    }
  };

  const aeronavesFiltradas = aeronaves.filter(a => 
    a.codigo.toLowerCase().includes(filtroBusca.toLowerCase()) || 
    a.modelo.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  // ==========================================
  // TELA 1: SELEÇÃO DE AERONAVE
  // ==========================================
  if (!aeronaveSelecionada) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Gerenciar Etapas de Produção</h1>
            <p className="text-slate-500 mt-1">Selecione uma aeronave para visualizar ou planejar sua linha de montagem.</p>
          </div>
          <div className="relative w-full md:w-64 shrink-0">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar aeronave..." value={filtroBusca} onChange={(e) => setFiltroBusca(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aeronavesFiltradas.map((aero) => {
            const qtdEtapas = etapas.filter(e => e.aeronaveId === aero.id).length;
            return (
              <div key={aero.id} onClick={() => setAeronaveSelecionada(aero)} className="group border border-slate-200 rounded-2xl p-6 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <IoAirplaneOutline size={40} />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-xl tracking-wider">[{aero.codigo}]</h2>
                  <p className="font-medium text-slate-500">{aero.modelo}</p>
                </div>
                <div className="mt-2 py-1 px-3 bg-slate-100 rounded-full text-xs font-bold text-slate-500">{qtdEtapas} etapa(s) cadastrada(s)</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 2: TIMELINE DA AERONAVE
  // ==========================================
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setAeronaveSelecionada(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors" title="Voltar para seleção">
            <IoArrowBackOutline size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><IoLayersOutline className="text-blue-600" /> Etapas: [{aeronaveSelecionada.codigo}]</h1>
            <p className="text-slate-500 mt-0.5 text-sm">Cronograma de produção do modelo {aeronaveSelecionada.modelo}</p>
          </div>
        </div>
        
        {isAdmin && (
          <button onClick={abrirModalNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
            <IoAddOutline size={20} /> Nova Etapa
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto py-6">
        {etapasAtuais.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
            <IoLayersOutline size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-600">Nenhuma etapa cadastrada</h3>
            <p className="text-sm text-slate-500 mt-1">A produção desta aeronave ainda não foi iniciada.</p>
          </div>
        ) : (
          <div className="relative border-l-4 border-slate-200 ml-6 pl-8 flex flex-col gap-8">
            {etapasAtuais.map((etapa, index) => {
              const estilo = getEstiloStatus(etapa.status);
              return (
                <div key={etapa.id} className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  
                  <div className={`absolute -left-[46px] top-5 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${estilo.cor}`}>
                    {estilo.icon}
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1 w-full md:w-2/3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ordem #{index + 1}</span>
                      <h3 className="text-lg font-black text-slate-800">{etapa.nome}</h3>
                      
                      <div className="flex flex-wrap gap-4 items-center mt-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          <IoTimeOutline size={14}/> Prazo: <span className="font-mono text-slate-700">{formatarData(etapa.prazo)}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1.5">
                          {etapa.funcionarios.map(func => (
                            <span key={func} className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm" title={func}>
                              <IoPersonOutline className="text-blue-500" />
                              {func.split(' ')[0]} 
                            </span>
                          ))}
                          
                          {/* NOVO: Botão de Editar Equipe visível para Admins e Operadores */}
                          {podeEditarEquipe && (
                            <button 
                              onClick={() => abrirModalEditarEquipe(etapa)}
                              className="ml-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-500 border border-blue-200 hover:border-blue-500 px-2 py-0.5 rounded transition-colors shadow-sm"
                            >
                              <IoPencilOutline /> Editar Equipe
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-1 w-full md:w-auto mt-4 md:mt-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status da Operação</span>
                      <select 
                        value={etapa.status} 
                        onChange={(e) => handleStatusChange(etapa.id, e.target.value)} 
                        className={`p-2 rounded-lg font-bold text-xs uppercase tracking-wide border-2 outline-none cursor-pointer transition-colors ${estilo.border}`}
                      >
                        <option value="PENDENTE">Pendente</option>
                        <option value="ANDAMENTO">Em Andamento</option>
                        <option value="CONCLUIDA">Concluída</option>
                      </select>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL DE NOVA ETAPA (Apenas Administrador)
      ========================================== */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Nova Etapa de Produção</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"><IoCloseOutline size={22} /></button>
            </div>
            
            <form onSubmit={handleSalvarNovaEtapa} className="p-6 flex flex-col gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <IoAirplaneOutline className="text-blue-600" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Vinculando à Aeronave</span>
                  <span className="font-bold text-blue-900">{aeronaveSelecionada.codigo} - {aeronaveSelecionada.modelo}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Nome da Etapa</label>
                <input required type="text" value={formData.nome || ''} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Instalação das Asas" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Data de Prazo</label>
                <input required type="date" value={formData.prazo || ''} onChange={(e) => setFormData({...formData, prazo: e.target.value})} className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-600" />
              </div>

              <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-2 mt-1">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <IoPeopleOutline className="text-blue-600" /> Equipe Alocada (Mín. 1)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border border-slate-200 rounded-lg bg-slate-50">
                  {MOCK_FUNCIONARIOS.map(func => (
                    <label key={func} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-200 p-1.5 rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={funcionariosSelecionados.includes(func)} 
                        onChange={() => toggleFuncionario(func)} 
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                      />
                      <span className="truncate">{func.split(' ')[0]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm transition-all">Cadastrar Etapa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DE EDIÇÃO DE EQUIPE
      ========================================== */}
      {isEditModalOpen && podeEditarEquipe && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Alterar Equipe</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"><IoCloseOutline size={22} /></button>
            </div>
            
            <form onSubmit={handleSalvarEdicaoEquipe} className="p-6 flex flex-col gap-4">
              <div className="mb-2">
                <span className="text-xs text-slate-500 uppercase font-bold">Etapa Selecionada</span>
                <p className="font-black text-slate-800">{etapaEditando?.nome}</p>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <IoPeopleOutline className="text-blue-600" /> Funcionários (Mín. 1)
                </label>
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {MOCK_FUNCIONARIOS.map(func => (
                    <label key={func} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-white p-2 rounded border border-transparent hover:border-slate-200 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={funcionariosSelecionados.includes(func)} 
                        onChange={() => toggleFuncionario(func)} 
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                      />
                      <span>{func}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors w-full">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm transition-all w-full">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DE SUCESSO GLOBAL
      ========================================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center animate-[scaleIn_0.3s_ease-out]">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-50 shadow-inner">
              <IoCheckmarkCircleOutline size={56} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Deu Certo!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">{successMessage}</p>
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}