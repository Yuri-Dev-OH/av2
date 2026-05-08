export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  nivel: 'Administrador' | 'Engenheiro' | 'Operador';
  funcoes: string;
}

export const USUARIOS_TESTE: Usuario[] = [
  { id: 1, nome: 'Yuri Admin', email: 'admin@aerocode.com', senha: '123', nivel: 'Administrador', funcoes: 'Acesso Total' },
  { id: 2, nome: 'Yuri Engenheiro', email: 'engenheiro@aerocode.com', senha: '123', nivel: 'Engenheiro', funcoes: 'Relatórios e Testes' },
  { id: 3, nome: 'Yuri Operador', email: 'operador@aerocode.com', senha: '123', nivel: 'Operador', funcoes: 'Produção' }
];