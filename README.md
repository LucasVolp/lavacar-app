# LavaCar App

Sistema de agendamento para lava-jatos e serviços automotivos.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **daisyUI** - Componentes UI
- **React Query** - Gerenciamento de estado do servidor
- **Axios** - Cliente HTTP
- **next-themes** - Gerenciamento de tema (dark/light)

## 📦 Instalação

1. Instale as dependências:

```bash
pnpm install
```

ou

```bash
npm install
```

## 🛠️ Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
pnpm dev
```

ou

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
lavacar-app/
├── app/                    # Rotas do Next.js (App Router)
│   ├── (auth)/            # Grupo de rotas de autenticação
│   ├── (main)/            # Grupo de rotas principais
│   ├── layout.tsx         # Layout raiz
│   └── providers.tsx      # Providers (React Query, Theme)
├── components/            # Componentes React
│   └── layout/           # Componentes de layout
├── services/              # Serviços de API
├── hooks/                 # Hooks customizados (React Query)
├── types/                 # Tipos TypeScript
├── utils/                 # Funções utilitárias
└── constants/             # Constantes
```

## 🎨 Padrões e Convenções

Este projeto segue os padrões estabelecidos no projeto de referência:

- **Estrutura de pastas**: Organização por feature/domínio
- **Services**: Encapsulam chamadas à API usando `axiosInstance`
- **Hooks**: Encapsulam `useQuery`/`useMutation` do React Query
- **Types**: Tipos TypeScript baseados no schema Prisma
- **Components**: Componentes reutilizáveis usando daisyUI
- **Layouts**: Separação entre rotas de autenticação e principais

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_STAGING_BACKEND_URL=https://staging-api.example.com
NEXT_PUBLIC_PRODUCTION_BACKEND_URL=https://api.example.com
```

## 📝 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Cria build de produção
- `pnpm start` - Inicia o servidor de produção
- `pnpm lint` - Executa o linter

## 🎯 Próximos Passos

- [ ] Implementar autenticação
- [ ] Criar páginas de agendamentos
- [ ] Criar páginas de veículos
- [ ] Criar páginas de lojas
- [ ] Implementar contextos de autenticação
- [ ] Adicionar testes
