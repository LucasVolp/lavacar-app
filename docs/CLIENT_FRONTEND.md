# Lavacar App - Frontend do Cliente

## 📌 Visão Geral

Frontend web para sistema SaaS multi-tenant de gestão e agendamento de estética automotiva. Esta fase implementa o **contexto do cliente final**.

## 🏗️ Arquitetura

### Stack Tecnológica
- **React 19** + **Next.js 16** (App Router)
- **TypeScript** (tipagem estrita)
- **Tailwind CSS** + **DaisyUI** (estilização)
- **Ant Design 6** (componentes UI)
- **TanStack React Query** (gerenciamento de estado do servidor)
- **Axios** (requisições HTTP)
- **Day.js** (manipulação de datas)

### Estrutura de Pastas

```
lavacar-app/
├── app/                          # Next.js App Router
│   ├── auth/                     # Páginas de autenticação
│   │   ├── login/               # Login do cliente
│   │   ├── register/            # Cadastro do cliente
│   │   └── callback/            # Callback OAuth (Google)
│   ├── shop/                    # Páginas da loja (cliente)
│   │   └── [slug]/              # Rota dinâmica por slug da loja
│   │       ├── page.tsx         # Página de entrada da loja
│   │       └── booking/         # Fluxo de agendamento
│   ├── layout.tsx               # Layout raiz
│   ├── providers.tsx            # Providers (Query, Theme, Auth, Shop)
│   └── page.tsx                 # Landing page
├── components/                   # Componentes React
│   ├── auth/                    # Componentes de autenticação
│   │   └── RequireAuth.tsx      # HOC de proteção de rota
│   └── booking/                 # Componentes de agendamento
│       ├── ServiceCard.tsx      # Card de serviço
│       ├── VehicleSelector.tsx  # Seletor de veículos
│       ├── DateTimePicker.tsx   # Seletor de data/hora
│       ├── BookingSummary.tsx   # Resumo do agendamento
│       └── AddVehicleModal.tsx  # Modal para adicionar veículo
├── contexts/                     # Contextos React
│   ├── AuthContext.tsx          # Gerenciamento de autenticação
│   └── ShopContext.tsx          # Gerenciamento do shop atual
├── hooks/                        # Custom Hooks
│   ├── useServices.ts           # Hook para serviços
│   ├── useVehicles.ts           # Hook para veículos
│   ├── useAppointments.ts       # Hook para agendamentos
│   ├── useSchedules.ts          # Hook para horários
│   └── useShops.ts              # Hook para lojas
├── services/                     # Serviços de API
│   ├── auth.ts                  # Autenticação
│   ├── appointment.ts           # Agendamentos
│   ├── shop.ts                  # Lojas
│   ├── service.ts               # Serviços
│   ├── vehicle.ts               # Veículos
│   ├── schedule.ts              # Horários
│   └── axiosInstance.ts         # Configuração Axios
├── types/                        # Tipos TypeScript
│   ├── appointment.ts
│   ├── shop.ts
│   ├── services.ts
│   ├── vehicle.ts
│   └── schedule.ts
└── utils/                        # Utilitários
```

## 🔐 Autenticação

### Fluxo
1. **Login/Registro**: Usuário acessa `/auth/login` ou `/auth/register`
2. **JWT**: Token armazenado em `localStorage.access_token`
3. **Axios Interceptor**: Adiciona `Authorization: Bearer <token>` automaticamente
4. **AuthContext**: Gerencia estado global de autenticação

### OAuth Google
- Suportado via redirect para `/auth/google`
- Callback em `/auth/callback` processa o token retornado

## 🏪 Contexto da Loja (Shop)

### Fluxo Multi-Tenant
1. Cliente acessa loja via slug: `/shop/lavacar-do-joao`
2. `ShopContext` carrega e armazena dados da loja
3. Todas as operações usam o `shopId` do contexto
4. ShopId persistido em `localStorage.current_shop_id`

## 📱 Telas Implementadas

### 1. Tela de Entrada da Loja (`/shop/[slug]`)
- **Acesso**: Público (não requer login)
- **Funcionalidades**:
  - Exibe nome, descrição e status da loja
  - Lista de serviços disponíveis com preços e duração
  - Horários de funcionamento
  - Informações de contato e endereço
  - Botão "Agendar Agora"

### 2. Telas de Login/Cadastro (`/auth/login`, `/auth/register`)
- **Funcionalidades**:
  - Login com email/senha
  - Cadastro de novo cliente
  - Login com Google (OAuth)
  - Redirecionamento após login para página original

### 3. Fluxo de Agendamento (`/shop/[slug]/booking`)
- **Acesso**: Requer autenticação
- **Funcionalidades** (3 etapas):
  1. **Seleção de Veículo**: Lista veículos do cliente, permite adicionar novo
  2. **Seleção de Serviços**: Múltiplos serviços podem ser selecionados
  3. **Data e Horário**: Calendário inteligente que:
     - Respeita horários de funcionamento
     - Bloqueia dias fechados
     - Calcula slots disponíveis
     - Considera antecedência mínima
     - Evita conflitos com agendamentos existentes
  4. **Resumo e Confirmação**: Preview com todos os dados

## 🔌 Integração com API

### Endpoints Consumidos

| Módulo | Endpoint | Uso |
|--------|----------|-----|
| Auth | `POST /auth/login` | Login |
| Auth | `POST /auth/register` | Cadastro |
| Auth | `GET /auth/me` | Dados do usuário logado |
| Shop | `GET /shop` | Listar lojas |
| Shop | `GET /shop/:id` | Detalhes da loja |
| Service | `GET /service` | Listar serviços |
| Vehicle | `GET /vehicle` | Listar veículos |
| Vehicle | `POST /vehicle` | Criar veículo |
| Schedule | `GET /schedule` | Horários de funcionamento |
| Appointment | `GET /appointments` | Listar agendamentos |
| Appointment | `POST /appointments` | Criar agendamento |

### Payload de Agendamento

```typescript
{
  scheduledAt: string;      // ISO 8601
  endTime: string;          // ISO 8601
  totalPrice: number;       // Soma dos serviços
  totalDuration: number;    // Minutos totais
  userId: string;           // ID do cliente
  shopId: string;           // ID da loja
  vehicleId: string;        // ID do veículo
  serviceIds: [{            // Snapshot dos serviços
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    duration: number;
  }]
}
```

## 🚀 Próximos Passos (Escalabilidade)

### Fase 2 - Cliente
- [ ] Histórico de agendamentos do cliente
- [ ] Cancelamento de agendamentos
- [ ] Gerenciamento de veículos
- [ ] Perfil do cliente

### Fase 3 - Features Avançadas
- [ ] Avaliações e reviews
- [ ] Notificações (push/email)
- [ ] Favoritos de lojas
- [ ] Integração de pagamentos

### Fase 4 - Painel Administrativo (Owner)
- [ ] Dashboard com métricas
- [ ] Gestão de serviços
- [ ] Gestão de horários
- [ ] Gestão de bloqueios
- [ ] Gerenciamento de agendamentos

## 🛠️ Decisões Técnicas

### Por que App Router?
- Melhor suporte a Server Components
- Layouts aninhados nativos
- Streaming e Suspense integrados

### Por que React Query?
- Cache automático
- Revalidação inteligente
- Deduplicação de requests
- Estados de loading/error integrados

### Por que Contextos para Auth/Shop?
- Simplicidade vs. stores globais
- Escopo bem definido
- Fácil de testar
- Pode migrar para Zustand/Redux se necessário

### Por que Ant Design?
- Componentes ricos e testados
- Tema customizável
- Boa documentação
- Já utilizado no projeto

## 🧪 Suposições Feitas

1. **API de Login/Register**: Assumido que existe `POST /auth/login` e `POST /auth/register` que retornam `{ accessToken, user }`
2. **Filtragem de Serviços**: Backend pode não filtrar por shopId, então fazemos no frontend
3. **Slots de Horário**: Calculados no frontend baseado em schedules e agendamentos existentes
4. **Refresh Token**: Não implementado nesta fase (mencionado no escopo)

## 📦 Como Executar

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL

# Executar em desenvolvimento
pnpm dev

# Build de produção
pnpm build
pnpm start
```

## 📝 Variáveis de Ambiente

```env
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```
