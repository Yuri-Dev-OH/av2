import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { 
  IoAddOutline, IoCloseOutline, IoAirplaneOutline, IoWarningOutline,
  IoHardwareChipOutline, IoLayersOutline, IoCheckmarkCircleOutline,
  IoSearchOutline, IoDocumentTextOutline, IoChevronDownOutline, IoChevronUpOutline
} from 'react-icons/io5';

interface PecaMock { nome: string; status: 'EM_PRODUCAO' | 'EM_TRANSPORTE' | 'PRONTA'; }
interface EtapaMock { nome: string; status: 'PENDENTE' | 'ANDAMENTO' | 'CONCLUIDA'; }
interface TesteMock { tipo: 'ELETRICO' | 'HIDRAULICO' | 'AERODINAMICO'; resultado: 'APROVADO' | 'REPROVADO'; }

interface Aeronave {
  codigo: string; modelo: string; tipo: 'COMERCIAL' | 'MILITAR';
  capacidade: number; alcance: number; pecas: PecaMock[]; etapas: EtapaMock[]; testes: TesteMock[];
}

const MOCK_AERONAVES: Aeronave[] = [
  {
    codigo: 'EMB-314', modelo: 'Super Tucano', tipo: 'MILITAR', capacidade: 2, alcance: 1330,
    pecas: [{ nome: 'Fuselagem Central', status: 'EM_PRODUCAO' }, { nome: 'Trem de Pouso', status: 'EM_TRANSPORTE' }, { nome: 'Motor Pratt & Whitney', status: 'PRONTA' }],
    etapas: [{ nome: 'Design e Validação', status: 'CONCLUIDA' }, { nome: 'Montagem Estrutural', status: 'ANDAMENTO' }, { nome: 'Pintura e Acabamento', status: 'PENDENTE' }],
    testes: [{ tipo: 'ELETRICO', resultado: 'APROVADO' }, { tipo: 'HIDRAULICO', resultado: 'APROVADO' }, { tipo: 'AERODINAMICO', resultado: 'REPROVADO' }]
  }
];

export default function Aeronaves() {
  // Controle de Permissões
  const sessao = localStorage.getItem('usuarioSessao');
  const usuarioLogado = sessao ? JSON.parse(sessao) : null;
  const isAdmin = usuarioLogado?.nivel === 'Administrador';
  const isEngenheiro = usuarioLogado?.nivel === 'Engenheiro';
  const podeGerarRelatorio = isAdmin || isEngenheiro;

  const [aeronaves, setAeronaves] = useState<Aeronave[]>(MOCK_AERONAVES);
  const [filtroCodigo, setFiltroCodigo] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Aeronave>>({ tipo: 'COMERCIAL' });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bloqueioTimer, setBloqueioTimer] = useState(3);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [aeroRelatorio, setAeroRelatorio] = useState<Aeronave | null>(null);
  const [isAeroInfoOpen, setIsAeroInfoOpen] = useState(false);
  const [clienteNome, setClienteNome] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [isReportConfirmModalOpen, setIsReportConfirmModalOpen] = useState(false);
  const [reportTimer, setReportTimer] = useState(3);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const successModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConfirmModalOpen && bloqueioTimer > 0) timer = setTimeout(() => setBloqueioTimer(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isConfirmModalOpen, bloqueioTimer]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReportConfirmModalOpen && reportTimer > 0) timer = setTimeout(() => setReportTimer(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isReportConfirmModalOpen, reportTimer]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (successModalRef.current && !successModalRef.current.contains(event.target as Node)) setIsSuccessModalOpen(false);
    };
    if (isSuccessModalOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSuccessModalOpen]);

  const abrirModalNovo = () => {
    setFormData({ tipo: 'COMERCIAL', capacidade: 0, alcance: 0 }); 
    setIsFormModalOpen(true);
  };

  const handlePreSalvar = (e: FormEvent) => {
    e.preventDefault(); setBloqueioTimer(3); setIsConfirmModalOpen(true);
  };

  const confirmarCadastro = () => {
    const novaAeronave: Aeronave = {
      codigo: formData.codigo || '', modelo: formData.modelo || '', tipo: formData.tipo as 'COMERCIAL' | 'MILITAR',
      capacidade: Number(formData.capacidade), alcance: Number(formData.alcance), pecas: [], etapas: [], testes: []
    };
    setAeronaves([...aeronaves, novaAeronave]);
    setIsConfirmModalOpen(false); setIsFormModalOpen(false);
    setSuccessMessage(`A aeronave ${novaAeronave.codigo} foi cadastrada com sucesso!`);
    setIsSuccessModalOpen(true);
  };

  const abrirModalRelatorio = (aero: Aeronave) => {
    setAeroRelatorio(aero); setClienteNome(''); setDataEntrega(''); setIsAeroInfoOpen(false); setIsReportModalOpen(true);
  };

  const handlePreGerarRelatorio = (e: FormEvent) => {
    e.preventDefault(); setReportTimer(3); setIsReportConfirmModalOpen(true);
  };

  const confirmarGeracaoRelatorio = () => {
    setIsReportConfirmModalOpen(false); setIsReportModalOpen(false);
    setSuccessMessage('O relatório final da aeronave foi gerado e está pronto para consulta posterior.');
    setIsSuccessModalOpen(true);
  };

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

  const aeronavesFiltradas = aeronaves.filter(a => a.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()));

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Frota de Aeronaves</h1>
          <p className="text-slate-500 mt-1">Gerencie a linha de produção e detalhes estruturais</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar pelo código..." value={filtroCodigo} onChange={(e) => setFiltroCodigo(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
          </div>
          {isAdmin && (
            <button onClick={abrirModalNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shrink-0">
              <IoAddOutline size={20} /> Nova Aeronave
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aeronavesFiltradas.map((aero, index) => (
          <div key={index} className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white hover:border-blue-300 transition-all flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <IoAirplaneOutline size={24} className="text-blue-600" />
                <div>
                  <h2 className="font-bold text-slate-800 text-lg uppercase tracking-wide">[{aero.codigo}]</h2>
                  <p className="text-sm font-semibold text-slate-500">{aero.modelo}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${aero.tipo === 'MILITAR' ? 'bg-slate-800 text-white border-slate-700' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>{aero.tipo}</span>
            </div>
            <div className="p-5 flex-grow flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex flex-col"><span className="text-slate-500 font-semibold text-[10px] uppercase">Capacidade</span><span className="font-mono font-bold text-slate-800">{aero.capacidade} passageiros</span></div>
                <div className="flex flex-col"><span className="text-slate-500 font-semibold text-[10px] uppercase">Alcance</span><span className="font-mono font-bold text-slate-800">{aero.alcance} km</span></div>
              </div>
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-2"><IoHardwareChipOutline size={16}/> Peças ({aero.pecas.length})</h3>
                  {aero.pecas.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {aero.pecas.map((peca, idx) => <li key={idx} className="text-sm text-slate-600 flex justify-between items-center bg-slate-50 border border-slate-100 px-3 py-1.5 rounded"><span className="font-medium">- {peca.nome}</span><span className={`font-mono font-bold text-[10px] border px-2 py-0.5 rounded ${getCorPeca(peca.status)}`}>{peca.status.replace('_', ' ')}</span></li>)}
                    </ul>
                  ) : <span className="text-xs text-slate-400 italic">Nenhuma vinculada</span>}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-2 mt-2"><IoLayersOutline size={16}/> Etapas ({aero.etapas.length})</h3>
                  {aero.etapas.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {aero.etapas.map((etapa, idx) => <li key={idx} className="text-sm text-slate-600 flex justify-between items-center bg-slate-50 border border-slate-100 px-3 py-1.5 rounded"><span className="font-medium">- {etapa.nome}</span><span className={`font-mono font-bold text-[10px] border px-2 py-0.5 rounded ${getCorEtapa(etapa.status)}`}>{etapa.status}</span></li>)}
                    </ul>
                  ) : <span className="text-xs text-slate-400 italic">Não iniciada</span>}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-2 mt-2"><IoCheckmarkCircleOutline size={16}/> Testes ({aero.testes.length})</h3>
                  {aero.testes.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {aero.testes.map((teste, idx) => <li key={idx} className="text-sm text-slate-600 flex justify-between items-center bg-slate-50 border border-slate-100 px-3 py-1.5 rounded"><span className="font-medium">- Teste {teste.tipo}</span><span className={`font-mono font-bold text-[10px] border px-2 py-0.5 rounded ${getCorTeste(teste.resultado)}`}>{teste.resultado}</span></li>)}
                    </ul>
                  ) : <span className="text-xs text-slate-400 italic">Nenhum registrado</span>}
                </div>
              </div>
            </div>
            
            {podeGerarRelatorio && (
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button onClick={() => abrirModalRelatorio(aero)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-600 rounded-lg font-bold text-sm transition-all shadow-sm"><IoDocumentTextOutline size={18} /> Gerar Relatório</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isFormModalOpen && !isConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Cadastrar Aeronave</h2>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><IoCloseOutline size={22} /></button>
            </div>
            <form onSubmit={handlePreSalvar} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Código Único</label><input required type="text" value={formData.codigo || ''} onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono" placeholder="Ex: EMB-190" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Tipo da Aeronave</label><select required value={formData.tipo || 'COMERCIAL'} onChange={(e) => setFormData({...formData, tipo: e.target.value as any})} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"><option value="COMERCIAL">COMERCIAL</option><option value="MILITAR">MILITAR</option></select></div>
              </div>
              <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Modelo</label><input required type="text" value={formData.modelo || ''} onChange={(e) => setFormData({...formData, modelo: e.target.value})} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: E-Jet E2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Capacidade</label><input required type="number" min="0" value={formData.capacidade || ''} onChange={(e) => setFormData({...formData, capacidade: Number(e.target.value)})} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 114" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Alcance (km)</label><input required type="number" min="0" value={formData.alcance || ''} onChange={(e) => setFormData({...formData, alcance: Number(e.target.value)})} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 5278" /></div>
              </div>
              <div className="mt-2 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-sm">Finalizar Cadastro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border-t-8 border-yellow-500 animate-[pulse_0.5s_ease-in-out]">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"><IoWarningOutline size={36} className="text-yellow-600" /></div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Atenção!</h2>
            <p className="text-slate-600 text-sm mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">Após confirmar, <strong>não será possível editar ou excluir</strong> os dados base desta aeronave ({formData.codigo}). Tem certeza que os dados estão corretos?</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmarCadastro} disabled={bloqueioTimer > 0} className={`px-5 py-3 rounded-xl font-bold transition-all ${bloqueioTimer > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md'}`}>{bloqueioTimer > 0 ? `Aguarde ${bloqueioTimer}s...` : 'Sim, Cadastrar Aeronave'}</button>
              <button onClick={() => setIsConfirmModalOpen(false)} className="px-5 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg font-medium transition-colors">Voltar para revisão</button>
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && !isReportConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Gerar Relatório de Entrega</h2>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><IoCloseOutline size={22} /></button>
            </div>
            <form onSubmit={handlePreGerarRelatorio} className="p-6 flex flex-col gap-5">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setIsAeroInfoOpen(!isAeroInfoOpen)} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-tight"><IoAirplaneOutline className="text-blue-600" /> Dados da Aeronave [{aeroRelatorio?.codigo}]</span>
                  {isAeroInfoOpen ? <IoChevronUpOutline size={18} /> : <IoChevronDownOutline size={18} />}
                </button>
                {isAeroInfoOpen && aeroRelatorio && (
                  <div className="p-4 bg-white text-xs font-mono space-y-3 border-t border-slate-200 max-h-60 overflow-y-auto">
                    <p><span className="font-bold text-blue-900 uppercase">Modelo:</span> {aeroRelatorio.modelo} | <span className="font-bold text-blue-900 uppercase">Tipo:</span> {aeroRelatorio.tipo}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Nome do Cliente</label><input required type="text" value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></div>
              <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Data de Entrega</label><input required type="text" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="DD/MM/AAAA" /></div>
              <div className="mt-2 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-sm transition-all">Confirmar Relatório</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReportConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border-t-8 border-yellow-500 animate-[bounceIn_0.4s_ease-out]">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"><IoWarningOutline size={36} className="text-yellow-600" /></div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Finalizar Relatório?</h2>
            <p className="text-slate-600 text-sm mb-6">Tem certeza que deseja processar a entrega da aeronave para <strong>{clienteNome}</strong>?</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmarGeracaoRelatorio} disabled={reportTimer > 0} className={`px-5 py-3 rounded-xl font-bold transition-all ${reportTimer > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md'}`}>{reportTimer > 0 ? `Aguarde ${reportTimer}s...` : 'Sim, Gerar Agora'}</button>
              <button onClick={() => setIsReportConfirmModalOpen(false)} className="px-5 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">Revisar Dados</button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div ref={successModalRef} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center animate-[scaleIn_0.3s_ease-out]">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-50 shadow-inner"><IoCheckmarkCircleOutline size={56} className="text-green-600" /></div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Deu Certo!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">{successMessage}</p>
            <button onClick={() => setIsSuccessModalOpen(false)} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-200 active:scale-95">OK</button>
          </div>
        </div>
      )}

    </div>
  );
}