# Aerocode - Gestão de Produção de Aeronaves (GUI Version) ✈️

O **Aerocode** evoluiu. O que antes era um protótipo em linha de comando agora é uma plataforma web completa para o gerenciamento do ciclo de vida de produção aeroespacial. Este sistema permite o controle desde o cadastro do chassi da aeronave até a certificação final e entrega ao cliente.

## 🚀 Novas Funcionalidades

- **Gestão de Frota:** Cadastro e visualização detalhada de modelos comerciais e militares.
- **Inventário de Peças:** Controle de componentes nacionais e importados vinculados a cada aeronave.
- **Timeline de Produção:** Gerenciamento de etapas sequenciais (uma etapa só pode ser concluída se a anterior estiver pronta).
- **Alocação de Equipe:** Registro obrigatório de funcionários por etapa de montagem.
- **Certificação de Qualidade:** Módulo de testes (Elétrico, Hidráulico e Aerodinâmico) com aprovação técnica.
- **Emissão de Relatórios:** Geração de documentos finais em formato TXT e visualização de PDF nativo.
- **Dev Switch:** Atalho lateral para alternar rapidamente entre níveis de permissão para testes de interface.

## 🔐 Níveis de Acesso (RBAC)

O sistema obedece a uma estrutura rigorosa de permissões:

| Nível | Descrição |
| :--- | :--- |
| **ADMINISTRADOR** | Acesso total: usuários, aeronaves, peças, etapas, testes e relatórios. |
| **ENGENHEIRO** | Gerencia testes, visualiza aeronaves/peças e gera relatórios. |
| **OPERADOR** | Lista aeronaves, atualiza status de peças/etapas e adiciona funcionários. |

## 🛠️ Tecnologias Utilizadas

- **React.js** com **Vite** (Fast Refresh e Performance)
- **TypeScript** (Tipagem estrita para segurança das regras de negócio)
- **Tailwind CSS** (Interface responsiva e moderna)
- **React Router Dom** (Navegação e proteção de rotas)
- **React Icons / Heroicons** (Identidade visual intuitiva)

## 📦 Como rodar o projeto

1. Clone o repositório e acesse a pasta do projeto:

```bash
   git clone https://github.com/Yuri-Dev-OH/av2.git
   cd av2
```

2. Instale as dependências:

```bash
   npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
   npm run dev
```

4. Acesse o endereço indicado no terminal (geralmente `http://localhost:5173`).

## 🧪 Credenciais de Teste (Senha padrão: 123)

- **ADM:** `admin@aerocode.com`
- **ENGENHEIRO:** `engenheiro@aerocode.com`
- **OPERADOR:** `operador@aerocode.com`

---
*Desenvolvido por Yuri Gonçalves de Souza.*