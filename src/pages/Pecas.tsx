import React, { useState } from 'react';
import { 
  IoAddOutline, IoCloseOutline, IoHardwareChipOutline, 
  IoAirplaneOutline, IoBusinessOutline, IoGlobeOutline,
  IoSearchOutline, IoPencilOutline, IoTrashOutline, IoFilterOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

// --- TIPAGENS ---
interface AeronaveResumo { id: string; codigo: string; modelo: string; }
interface Peca { id: string; nome: string; tipo: 'NACIONAL' | 'IMPORTADA'; fornecedor: string; status: 'EM_PRODUCAO' | 'EM_TRANSPORTE' | 'PRONTA'; aeronave: AeronaveResumo; }

// --- DADOS MOCKADOS ---
const MOCK_AERONAVES_ATIVAS: AeronaveResumo[] = [
  { id: 'a1', codigo: 'EMB-314', modelo: 'Super Tucano' },
  { id: 'a2', codigo: 'EMB-190', modelo: 'E-Jet E2' },
  { id: 'a3', codigo: 'KC-390', modelo: 'Millennium' }
];

const MOCK_PECAS: Peca[] = [
  { id: 'p1', nome: 'Fuselagem Central', tipo: 'NACIONAL', fornecedor: 'Embraer Estruturas SJC', status: 'EM_PRODUCAO', aeronave: MOCK_AERONAVES_ATIVAS[0] },
  { id: 'p2', nome: 'Motor Pratt & Whitney PT6', tipo: 'IMPORTADA', fornecedor: 'Pratt & Whitney Canada', status: 'PRONTA', aeronave: MOCK_AERONAVES_ATIVAS[0] },
  { id: 'p3', nome: 'Painel de Aviônicos', tipo: 'IMPORTADA', fornecedor: 'Honeywell Aerospace', status: 'EM_TRANSPORTE', aeronave: MOCK_AERONAVES_ATIVAS[1] }
];

export default function Pecas() {
  const [pecas, setPecas] = useState<Peca[]>(MOCK_PECAS);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  
  const [formData, setFormData] = useState<Partial<Peca> & { aeronaveId?: string }>({ tipo: 'NACIONAL', status: 'EM_PRODUCAO' });

  // --- ESTADOS DO MODAL DE SUCESSO ---
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const abrirModalNovo = () => {
    setPecaSelecionada(null);
    setFormData({ tipo: 'NACIONAL', status: 'EM_PRODUCAO', aeronaveId: MOCK_AERONAVES_ATIVAS[0].id });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (peca: Peca) => {
    setPecaSelecionada(peca);
    setFormData({ ...peca, aeronaveId: peca.aeronave.id });
    setIsModalOpen(true);
  };

  const abrirModalExcluir = (peca: Peca) => {
    setPecaSelecionada(peca); setIsDeleteModalOpen(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    const aeronaveSelecionada = MOCK_AERONAVES_ATIVAS.find(a => a.id === formData.aeronaveId);
    if (!aeronaveSelecionada) return;

    if (pecaSelecionada) {
      const listaAtualizada = pecas.map(p => {
        if (p.id === pecaSelecionada.id) {
          return { ...p, nome: formData.nome!, tipo: formData.tipo as any, fornecedor: formData.fornecedor!, status: formData.status as any, aeronave: aeronaveSelecionada };
        }
        return p;
      });
      setPecas(listaAtualizada);
      setSuccessMessage(`A peça "${formData.nome}" foi atualizada com sucesso!`);
    } else {
      const novaPeca: Peca = {
        id: `p${Date.now()}`, nome: formData.nome!, tipo: formData.tipo as any, fornecedor: formData.fornecedor!, status: formData.status as any, aeronave: aeronaveSelecionada
      };
      setPecas([...pecas, novaPeca]);
      setSuccessMessage(`A peça "${novaPeca.nome}" foi cadastrada com sucesso!`);
    }
    
    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const confirmarExclusao = () => {
    if (pecaSelecionada) {
      setPecas(pecas.filter(p => p.id !== pecaSelecionada.id));
      setIsDeleteModalOpen(false);
    }
  };

  const getCorStatus = (status: string) => {
    if (status === 'PRONTA') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'EM_TRANSPORTE') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const getCorTipo = (tipo: string) => {
    if (tipo === 'NACIONAL') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (tipo === 'IMPORTADA') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-50 text-slate-500 border-slate-200';
  };

  const pecasFiltradas = pecas.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(filtroBusca.toLowerCase()) || p.aeronave.codigo.toLowerCase().includes(filtroBusca.toLowerCase());
    const matchStatus = filtroStatus === 'TODOS' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh]">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Inventário de Peças</h1>
          <p className="text-slate-500 mt-1">Gerencie os componentes e vincule-os às aeronaves</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-64 shrink-0">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar peça ou avião..." value={filtroBusca} onChange={(e) => setFiltroBusca(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
          </div>
          <div className="relative w-full md:w-48 shrink-0">
            <IoFilterOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white appearance-none cursor-pointer">
              <option value="TODOS">Todos os Status</option><option value="EM_PRODUCAO">Em Produção</option><option value="EM_TRANSPORTE">Em Transporte</option><option value="PRONTA">Pronta</option>
            </select>
          </div>
          <button onClick={abrirModalNovo} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full md:w-auto rounded-lg font-medium transition-colors shrink-0">
            <IoAddOutline size={20} /> Nova Peça
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pecasFiltradas.map((peca) => (
          <div key={peca.id} className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col relative">
            <div className="absolute top-4 right-4 flex gap-2"><span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-md border flex items-center gap-1 ${getCorTipo(peca.tipo)}`}><IoGlobeOutline size={12} /> {peca.tipo}</span></div>
            <div className="p-5 pb-3">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition-transform"><IoHardwareChipOutline size={24} /></div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight pr-20">{peca.nome}</h2>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500"><IoBusinessOutline className="shrink-0" /><span className="truncate">{peca.fornecedor}</span></div>
            </div>
            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
              <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500 uppercase">Status Atual</span><span className={`font-mono font-bold text-[10px] border px-2 py-1 rounded tracking-wide ${getCorStatus(peca.status)}`}>{peca.status.replace('_', ' ')}</span></div>
              <div className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md shrink-0"><IoAirplaneOutline size={18} /></div>
                <div className="flex flex-col overflow-hidden"><span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Vinculado à Aeronave</span><span className="text-sm font-bold text-slate-700 leading-tight truncate">{peca.aeronave.codigo} <span className="text-xs font-normal text-slate-500">- {peca.aeronave.modelo}</span></span></div>
              </div>
              <div className="flex gap-2 justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => abrirModalEditar(peca)} className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"><IoPencilOutline size={16} /></button>
                 <button onClick={() => abrirModalExcluir(peca)} className="p-2 bg-white border border-slate-200 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors"><IoTrashOutline size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3"><div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><IoHardwareChipOutline size={20} /></div><h2 className="text-xl font-bold text-slate-800">{pecaSelecionada ? 'Editar Peça' : 'Cadastrar Nova Peça'}</h2></div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"><IoCloseOutline size={22} /></button>
            </div>
            <form onSubmit={handleSalvar} className="p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="p-4 bg-slate-50 border border-blue-200 rounded-xl flex flex-col gap-2">
                <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><IoAirplaneOutline size={18}/> A qual aeronave esta peça pertence?</label>
                <select required value={formData.aeronaveId || ''} onChange={(e) => setFormData({...formData, aeronaveId: e.target.value})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-slate-700 shadow-sm">
                  {MOCK_AERONAVES_ATIVAS.map(aero => <option key={aero.id} value={aero.id}>{aero.codigo} - {aero.modelo}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Nome da Peça</label><input required type="text" value={formData.nome || ''} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Trem de Pouso Dianteiro" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Fornecedor Responsável</label><input required type="text" value={formData.fornecedor || ''} onChange={(e) => setFormData({...formData, fornecedor: e.target.value})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Embraer / Pratt & Whitney" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Tipo de Peça</label><select required value={formData.tipo || 'NACIONAL'} onChange={(e) => setFormData({...formData, tipo: e.target.value as any})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"><option value="NACIONAL">NACIONAL</option><option value="IMPORTADA">IMPORTADA</option></select></div>
                  <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Status Atual</label><select required value={formData.status || 'EM_PRODUCAO'} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"><option value="EM_PRODUCAO">EM PRODUÇÃO</option><option value="EM_TRANSPORTE">EM TRANSPORTE</option><option value="PRONTA">PRONTA</option></select></div>
                </div>
              </div>
              <div className="mt-2 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm">Salvar Peça</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-[scaleIn_0.2s_ease-out]">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><IoTrashOutline size={32} className="text-red-600" /></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Remover Peça?</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">Tem certeza que deseja desvincular <strong>{pecaSelecionada?.nome}</strong>?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium w-full">Cancelar</button>
              <button onClick={confirmarExclusao} className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-bold w-full">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO GLOBAL */}
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