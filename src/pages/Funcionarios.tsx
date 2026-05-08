import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoAddOutline, IoTrashOutline, IoPencilOutline, IoCloseOutline,
  IoShieldCheckmarkOutline, IoConstructOutline, IoCogOutline,
  IoCallOutline, IoLocationOutline, IoPersonOutline, IoCheckmarkCircleOutline
} from 'react-icons/io5';

interface Funcionario { id: string; nome: string; nivel: 'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR'; telefone: string; endereco: string; user: string; }

const MOCK_INICIAL: Funcionario[] = [
  { id: '001', nome: 'Yuri Goncalves', nivel: 'ADMINISTRADOR', telefone: '(12) 99999-9999', endereco: 'Rua das Aviações, 100 - SJC', user: 'admin' },
  { id: '002', nome: 'Engenheiro Chefe', nivel: 'ENGENHEIRO', telefone: '(12) 88888-8888', endereco: 'Av. Tecnológica, 500 - SJC', user: 'engenheiro' },
  { id: '003', nome: 'Operador Padrao', nivel: 'OPERADOR', telefone: '(12) 77777-7777', endereco: 'Polo Industrial, Galpão 3 - SJC', user: 'operador' },
];

const CARGOS_DISPONIVEIS = [
  { valor: 'ADMINISTRADOR', titulo: 'Administrador', icone: IoShieldCheckmarkOutline, descricao: 'Acesso irrestrito a todas as funcionalidades.' },
  { valor: 'ENGENHEIRO', titulo: 'Engenheiro', icone: IoConstructOutline, descricao: 'Gestão de testes e geração de relatórios.' },
  { valor: 'OPERADOR', titulo: 'Operador', icone: IoCogOutline, descricao: 'Atualização na produção e cadastro de pessoas.' },
];

export default function Funcionarios() {
  const navigate = useNavigate();
  
  // Controle de Permissões
  const sessao = localStorage.getItem('usuarioSessao');
  const usuario = sessao ? JSON.parse(sessao) : null;
  const isAdmin = usuario?.nivel === 'Administrador';
  const isOperador = usuario?.nivel === 'Operador';

  useEffect(() => {
    // Apenas Admins e Operadores entram nesta tela
    if (!isAdmin && !isOperador) {
      navigate('/dashboard/home', { replace: true });
    }
  }, [isAdmin, isOperador, navigate]);

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(MOCK_INICIAL);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [funcEmEdicao, setFuncEmEdicao] = useState<Funcionario | null>(null);
  const [formData, setFormData] = useState<Partial<Funcionario>>({});

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const abrirModalNovo = () => {
    setFuncEmEdicao(null);
    setFormData({ nivel: 'OPERADOR' }); 
    setIsFormModalOpen(true);
  };

  const abrirModalEditar = (func: Funcionario) => {
    setFuncEmEdicao(func);
    setFormData({ ...func });
    setIsFormModalOpen(true);
  };

  const abrirModalExcluir = (func: Funcionario) => {
    setFuncEmEdicao(func);
    setIsDeleteModalOpen(true);
  };

  const handleSalvar = (e: FormEvent) => {
    e.preventDefault();
    if (funcEmEdicao) {
      const novaLista = funcionarios.map(f => f.id === funcEmEdicao.id ? { ...f, ...formData } as Funcionario : f);
      setFuncionarios(novaLista);
      setSuccessMessage(`O funcionário "${formData.nome}" foi atualizado com sucesso!`);
    } else {
      const novoId = String(funcionarios.length + 1).padStart(3, '0');
      const novoFunc = { ...formData, id: novoId } as Funcionario;
      setFuncionarios([...funcionarios, novoFunc]);
      setSuccessMessage(`O funcionário "${novoFunc.nome}" foi cadastrado no sistema!`);
    }
    
    setIsFormModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const confirmarExclusao = () => {
    if (!funcEmEdicao) return;
    if (funcEmEdicao.nivel === 'ADMINISTRADOR') {
      const qtdAdmins = funcionarios.filter((f) => f.nivel === 'ADMINISTRADOR').length;
      if (qtdAdmins <= 1) {
        alert('O sistema deve conter pelo menos 1 Administrador!');
        setIsDeleteModalOpen(false);
        return;
      }
    }
    setFuncionarios(funcionarios.filter(f => f.id !== funcEmEdicao.id));
    setIsDeleteModalOpen(false);
  };

  const getEstiloNivel = (nivel: string) => {
    switch(nivel) {
      case 'ADMINISTRADOR': return 'bg-red-100 text-red-700 border-red-200';
      case 'ENGENHEIRO': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'OPERADOR': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[60vh]">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quadro de Funcionários</h1>
          <p className="text-slate-500 mt-1">Gerencie a equipe que opera o sistema</p>
        </div>
        <button onClick={abrirModalNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <IoAddOutline size={20} /> Novo Funcionário
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {funcionarios.map((func) => (
          <div key={func.id} className="border border-slate-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-blue-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl border border-slate-200">
                {func.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-slate-800 text-lg">{func.nome}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getEstiloNivel(func.nivel)}`}>{func.nivel}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><IoPersonOutline className="text-slate-400"/> @{func.user}</span>
                  <span className="flex items-center gap-1"><IoCallOutline className="text-slate-400"/> {func.telefone}</span>
                  <span className="flex items-center gap-1"><IoLocationOutline className="text-slate-400"/> {func.endereco}</span>
                </div>
              </div>
            </div>
            
            {/* Somente o Administrador vê os botões de edição e exclusão */}
            {isAdmin && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button onClick={() => abrirModalEditar(func)} className="p-2 bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"><IoPencilOutline size={18} /></button>
                <button onClick={() => abrirModalExcluir(func)} className="p-2 bg-slate-100 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors"><IoTrashOutline size={18} /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-bold text-slate-800">{funcEmEdicao ? 'Editar' : 'Cadastrar'} Funcionário</h2>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"><IoCloseOutline size={22} /></button>
            </div>
            <form onSubmit={handleSalvar} className="p-6 flex flex-col gap-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Nome Completo</label><input required type="text" value={formData.nome || ''} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: João da Silva" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Usuário de Login (User)</label><input required type="text" value={formData.user || ''} onChange={(e) => setFormData({...formData, user: e.target.value})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: joao.silva" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Telefone</label><input required type="text" value={formData.telefone || ''} onChange={(e) => setFormData({...formData, telefone: e.target.value})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(12) 90000-0000" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-slate-700">Endereço</label><input required type="text" value={formData.endereco || ''} onChange={(e) => setFormData({...formData, endereco: e.target.value})} className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Rua, Número - Cidade" /></div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-bold text-slate-700">Hierarquia (Nível)</label>
                <div className="grid grid-cols-3 gap-3">
                  {CARGOS_DISPONIVEIS.map((cargo) => (
                    <div key={cargo.valor} onClick={() => setFormData({...formData, nivel: cargo.valor as any})} className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center gap-3 transition-all ${formData.nivel === cargo.valor ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-sm' : 'border-slate-200 hover:border-blue-300 bg-white'}`}>
                      <div className={`p-3 rounded-full ${formData.nivel === cargo.valor ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}><cargo.icone size={28} /></div>
                      <div className="flex flex-col"><span className={`font-bold ${formData.nivel === cargo.valor ? 'text-blue-900' : 'text-slate-700'}`}>{cargo.titulo}</span><span className="text-xs text-slate-500 mt-1">{cargo.descricao}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-sm">Salvar Dados</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><IoTrashOutline size={32} className="text-red-600" /></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Excluir Funcionário?</h2>
            <p className="text-slate-500 mb-8 text-sm">Tem certeza que deseja remover <strong>{funcEmEdicao?.nome}</strong> do sistema?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium w-full">Cancelar</button>
              <button onClick={confirmarExclusao} className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium shadow-sm w-full">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

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