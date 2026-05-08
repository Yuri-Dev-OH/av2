import React, { useState } from 'react';
import { 
  IoAddOutline, IoCloseOutline, IoAirplaneOutline, IoArrowBackOutline, 
  IoCheckmarkCircleOutline, IoSearchOutline, IoTrashOutline, IoPencilOutline,
  IoFilterOutline, IoFlashOutline, IoWaterOutline, IoPaperPlaneOutline,
  IoWarningOutline
} from 'react-icons/io5';

// --- TIPAGENS ---
interface AeronaveResumo {
  id: string;
  codigo: string;
  modelo: string;
}

interface Teste {
  id: string;
  aeronaveId: string;
  tipo: 'ELETRICO' | 'HIDRAULICO' | 'AERODINAMICO';
  resultado: 'APROVADO' | 'REPROVADO';
}

// --- DADOS MOCKADOS ---
const MOCK_AERONAVES: AeronaveResumo[] = [
  { id: 'a1', codigo: 'EMB-314', modelo: 'Super Tucano' },
  { id: 'a2', codigo: 'EMB-190', modelo: 'E-Jet E2' },
  { id: 'a3', codigo: 'KC-390', modelo: 'Millennium' }
];

const MOCK_TESTES: Teste[] = [
  { id: 't1', aeronaveId: 'a1', tipo: 'ELETRICO', resultado: 'APROVADO' },
  { id: 't2', aeronaveId: 'a1', tipo: 'HIDRAULICO', resultado: 'APROVADO' },
  { id: 't3', aeronaveId: 'a1', tipo: 'AERODINAMICO', resultado: 'REPROVADO' },
  { id: 't4', aeronaveId: 'a2', tipo: 'ELETRICO', resultado: 'APROVADO' }
];

export default function Testes() {
  const [aeronaves] = useState<AeronaveResumo[]>(MOCK_AERONAVES);
  const [testes, setTestes] = useState<Teste[]>(MOCK_TESTES);
  
  // Estados de Busca e Navegação
  const [filtroBuscaAeronave, setFiltroBuscaAeronave] = useState('');
  const [aeronaveSelecionada, setAeronaveSelecionada] = useState<AeronaveResumo | null>(null);

  // Estados de Filtro da Lista de Testes
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroResultado, setFiltroResultado] = useState('TODOS');

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testeSelecionado, setTesteSelecionado] = useState<Teste | null>(null);
  const [formData, setFormData] = useState<Partial<Teste>>({ tipo: 'ELETRICO', resultado: 'APROVADO' });

  // Estados do Modal de Sucesso
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- LÓGICA DE ABERTURA DE MODAIS ---
  const abrirModalNovo = () => {
    setTesteSelecionado(null);
    setFormData({ tipo: 'ELETRICO', resultado: 'APROVADO' });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (teste: Teste) => {
    setTesteSelecionado(teste);
    setFormData({ ...teste });
    setIsModalOpen(true);
  };

  const abrirModalExcluir = (teste: Teste) => {
    setTesteSelecionado(teste);
    setIsDeleteModalOpen(true);
  };

  // --- LÓGICA DE SALVAMENTO ---
  const handleSalvarTeste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aeronaveSelecionada) return;

    if (testeSelecionado) {
      // Editar
      const listaAtualizada = testes.map(t => {
        if (t.id === testeSelecionado.id) {
          return {
            ...t,
            tipo: formData.tipo as any,
            resultado: formData.resultado as any
          };
        }
        return t;
      });
      setTestes(listaAtualizada);
      setSuccessMessage(`O Teste ${formData.tipo} foi atualizado com sucesso!`);
    } else {
      // Criar Novo
      const novoTeste: Teste = {
        id: `t${Date.now()}`,
        aeronaveId: aeronaveSelecionada.id,
        tipo: formData.tipo as any,
        resultado: formData.resultado as any
      };
      setTestes([...testes, novoTeste]);
      setSuccessMessage(`O Teste ${novoTeste.tipo} foi registrado com sucesso!`);
    }
    
    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const confirmarExclusao = () => {
    if (testeSelecionado) {
      setTestes(testes.filter(t => t.id !== testeSelecionado.id));
      setIsDeleteModalOpen(false);
    }
  };

  // --- AUXILIARES VISUAIS ---
  const getIconeTipo = (tipo: string) => {
    switch(tipo) {
      case 'ELETRICO': return <IoFlashOutline size={24} className="text-yellow-500" />;
      case 'HIDRAULICO': return <IoWaterOutline size={24} className="text-blue-500" />;
      case 'AERODINAMICO': return <IoPaperPlaneOutline size={24} className="text-purple-500" />;
      default: return null;
    }
  };

  const getEstiloResultado = (resultado: string) => {
    return resultado === 'APROVADO' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  // --- FILTRAGENS ---
  const aeronavesFiltradas = aeronaves.filter(a => 
    a.codigo.toLowerCase().includes(filtroBuscaAeronave.toLowerCase()) || 
    a.modelo.toLowerCase().includes(filtroBuscaAeronave.toLowerCase())
  );

  const testesAtuais = aeronaveSelecionada ? testes.filter(t => t.aeronaveId === aeronaveSelecionada.id) : [];
  
  const testesFiltrados = testesAtuais.filter(t => {
    const matchTipo = filtroTipo === 'TODOS' || t.tipo === filtroTipo;
    const matchResultado = filtroResultado === 'TODOS' || t.resultado === filtroResultado;
    return matchTipo && matchResultado;
  });

  // ==========================================
  // TELA 1: SELEÇÃO DE AERONAVE
  // ==========================================
  if (!aeronaveSelecionada) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Controle de Testes</h1>
            <p className="text-slate-500 mt-1">Selecione uma aeronave para registrar ou consultar seus testes de qualidade.</p>
          </div>
          
          <div className="relative w-full md:w-64 shrink-0">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar aeronave..." 
              value={filtroBuscaAeronave}
              onChange={(e) => setFiltroBuscaAeronave(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aeronavesFiltradas.map((aero) => {
            const qtdTestes = testes.filter(t => t.aeronaveId === aero.id).length;
            const qtdReprovados = testes.filter(t => t.aeronaveId === aero.id && t.resultado === 'REPROVADO').length;
            
            return (
              <div 
                key={aero.id}
                onClick={() => {
                  setAeronaveSelecionada(aero);
                  setFiltroTipo('TODOS');
                  setFiltroResultado('TODOS');
                }}
                className="group border border-slate-200 rounded-2xl p-6 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center gap-4 relative overflow-hidden"
              >
                {qtdReprovados > 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    {qtdReprovados} REPROVADO(S)
                  </div>
                )}
                
                <div className="w-20 h-20 bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <IoAirplaneOutline size={40} />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-xl tracking-wider">[{aero.codigo}]</h2>
                  <p className="font-medium text-slate-500">{aero.modelo}</p>
                </div>
                <div className="mt-2 py-1 px-3 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                  {qtdTestes} teste(s) registrado(s)
                </div>
              </div>
            );
          })}
          
          {aeronavesFiltradas.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              Nenhuma aeronave encontrada com este filtro.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 2: LISTA DE TESTES DA AERONAVE
  // ==========================================
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh]">
      
      {/* HEADER E FILTROS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAeronaveSelecionada(null)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
            title="Voltar para seleção"
          >
            <IoArrowBackOutline size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <IoCheckmarkCircleOutline className="text-blue-600" />
              Testes: [{aeronaveSelecionada.codigo}]
            </h1>
            <p className="text-slate-500 mt-0.5 text-sm">Qualidade e certificação do modelo {aeronaveSelecionada.modelo}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Filtro de Tipo */}
          <div className="relative w-full md:w-48 shrink-0">
            <IoFilterOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white cursor-pointer"
            >
              <option value="TODOS">Todos os Tipos</option>
              <option value="ELETRICO">Elétrico</option>
              <option value="HIDRAULICO">Hidráulico</option>
              <option value="AERODINAMICO">Aerodinâmico</option>
            </select>
          </div>

          {/* Filtro de Status */}
          <div className="relative w-full md:w-48 shrink-0">
            <IoFilterOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={filtroResultado}
              onChange={(e) => setFiltroResultado(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white cursor-pointer"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="APROVADO">Aprovado</option>
              <option value="REPROVADO">Reprovado</option>
            </select>
          </div>

          <button 
            onClick={abrirModalNovo}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full md:w-auto rounded-lg font-bold transition-colors shadow-sm shrink-0"
          >
            <IoAddOutline size={20} />
            Novo Teste
          </button>
        </div>
      </div>

      {/* GRID DE TESTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testesFiltrados.map((teste) => (
          <div key={teste.id} className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col gap-4">
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {getIconeTipo(teste.tipo)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo de Teste</span>
                  <h3 className="text-lg font-black text-slate-800">{teste.tipo}</h3>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => abrirModalEditar(teste)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                  <IoPencilOutline size={18} />
                </button>
                <button onClick={() => abrirModalExcluir(teste)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                  <IoTrashOutline size={18} />
                </button>
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Status do Teste</span>
              <span className={`font-mono font-bold text-xs border px-3 py-1 rounded-md tracking-widest ${getEstiloResultado(teste.resultado)}`}>
                {teste.resultado}
              </span>
            </div>

          </div>
        ))}

        {testesFiltrados.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            <IoCheckmarkCircleOutline size={48} className="mb-4 opacity-50" />
            <p className="font-medium text-slate-500 text-lg">Nenhum teste encontrado.</p>
            <p className="text-sm">Ajuste os filtros ou cadastre um novo teste para esta aeronave.</p>
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL DE CADASTRO/EDIÇÃO DE TESTE
      ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{testeSelecionado ? 'Editar Teste' : 'Registrar Novo Teste'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <IoCloseOutline size={22} />
              </button>
            </div>

            <form onSubmit={handleSalvarTeste} className="p-6 flex flex-col gap-5">
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <IoAirplaneOutline className="text-blue-600" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Aeronave Vinculada</span>
                  <span className="font-bold text-blue-900">{aeronaveSelecionada.codigo} - {aeronaveSelecionada.modelo}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Tipo de Teste</label>
                <select 
                  required
                  value={formData.tipo || 'ELETRICO'} 
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as any})} 
                  className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-slate-700"
                >
                  <option value="ELETRICO">ELÉTRICO</option>
                  <option value="HIDRAULICO">HIDRÁULICO</option>
                  <option value="AERODINAMICO">AERODINÂMICO</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Resultado / Status</label>
                <select 
                  required
                  value={formData.resultado || 'APROVADO'} 
                  onChange={(e) => setFormData({...formData, resultado: e.target.value as any})} 
                  className={`p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold tracking-widest ${
                    formData.resultado === 'APROVADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-red-50 text-red-700 border-red-300'
                  }`}
                >
                  <option value="APROVADO">APROVADO</option>
                  <option value="REPROVADO">REPROVADO</option>
                </select>
              </div>

              <div className="mt-2 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm transition-all">Salvar Teste</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL DE EXCLUSÃO
      ========================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-[scaleIn_0.2s_ease-out]">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoWarningOutline size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Remover Teste?</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Tem certeza que deseja apagar o registro do teste <strong>{testeSelecionado?.tipo}</strong> da aeronave {aeronaveSelecionada.codigo}?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors w-full">Cancelar</button>
              <button onClick={confirmarExclusao} className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-bold shadow-sm transition-colors w-full">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL DE SUCESSO GLOBAL
      ========================================= */}
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