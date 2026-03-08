# Rent-a-Car & Transfers Platform (Moçambique)

Uma plataforma completa ("premium") para aluguer de viaturas de luxo e reservas de transfers (aeroportos/rotas), desenhada especificamente para o mercado moçambicano.

## Arquitetura do Sistema

O projeto é construído numa arquitetura full-stack moderna:

- **Backend**: NestJS (TypeScript), Prisma ORM, JWT Authentication.
- **Frontend**: React (Vite), TypeScript, TailwindCSS, `@tanstack/react-query`, Lucide Icons, Shadcn-like components.
- **Base de Dados**: MySQL 8.
- **Infraestrutura**: Contentores Docker (app full-stack através do Docker Compose).

## Principais Funcionalidades

### Área de Cliente (Pública e Privada)

- **Home Page Premium**: Design elegante usando _glassmorphism_ e paletas Tailwind teal/cyan e amber/orange.
- **Pesquisa Dinâmica**: Pesquisa de viaturas por região, datas e categoria; Pesquisa de Transfers por rotas.
- **Motor de Reservas Integrado**:
  - Registo rápido _on-the-fly_ via submissão de um único formulário no "Checkout".
  - Processo de Checkout fluido agrupando aluguer e cliente no mesmo cesto.
- **Lifecycle Extensível de Reservas (Fase 10)**: O cliente sabe sempre o estado da reserva (`PENDENTE`, `AGUARDANDO PAGAMENTO`, `PAGA`, `EM USO`, `CONCLUÍDA`). Inclui dados de pagamento com referências bancárias auto-geradas.
- **As Minhas Reservas**: Área do utilizador para consultar o histórico, aceder aos dados de pagamento e visualizar os recibos informativos.

### Painel de Administração

- **Dashboard (KPIs)**: Gráficos de receita mensal e conversão de reservas, totalmente atualizados em tempo real, integrando veículos e transfers.
- **Gestão de Frota**: Adicionar/editar viaturas, definir categoria, características, lotação e preços diários.
- **Gestão de Transfers**: Controlar serviços de transporte e rotas específicas.
- **Motor de Fluxo de Reservas**:
  - Aceitar paralelismo (múltiplas reservas `PENDENTES` na mesma data não bloqueiam calendário).
  - Bloqueio estrito de datas aquando da passagem para `CONFIRMADA`.
  - Botões de ação sequenciais: `Confirmar Pagamento` ➝ `Entregar Viatura` ➝ `Confirmar Devolução`.
- **Sistema de Notificações em Tempo Real (Fase 11)**: Ícone no cabeçalho (_bell_) que acende e faz _polling_ imediato de novas reservas a chegar à caixa do Administrador, mantendo-o sempre informado.

## Como Iniciar o Projeto Localmente

### Pré-requisitos

- Node.js `v20+`
- Base de Dados MySQL 8 a correr localmente ou remotamente
- NPM

### Passos de Configuração

**1. Instalar dependências**
Na raiz do projeto (ou em abas separadas):

```bash
cd backend && npm install
cd ../frontend && npm install
```

**2. Configurar o Ambiente**
O código já incluiu o ficheiro `.env.example`. Na pasta `backend/`, garanta que existe o ficheiro `.env` com os detalhes da sua base de dados MySQL conectada:

```env
DATABASE_URL="mysql://root:root@localhost:33006/rentacar"
JWT_SECRET="secret_super_seguro_rentacar_2026"
```

**3. Preparar a Base de Dados (Terminal 1)**

Navegue para a directoria do backend e inicialize a base de dados:

```bash
cd backend
npx prisma generate
npx prisma db push
## Preencher a DB com Dados Reais/Mock:
npx ts-node prisma/seed.ts
```

**4. Correr o Backend**
Ainda no `Terminal 1`, inicie o servidor:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3001/api`.

**5. Correr o Frontend (Terminal 2)**

```bash
cd frontend
npm run dev
```

Acessar por `http://localhost:5173`.

- **Admin App**: Faça o login usando a conta semeada (`admin@rentacar.co.mz` / `admin123`).
- **Client App**: Pode navegar publicamente como visitante ou registar em _checkout_ (ou usar o cliente semeado: `joao@email.com` / `cliente123`).

## Considerações

Este _software_ foi desenhado para escalabilidade robusta, resiliência na normalização de dados e segurança (JWT).

- O frontend compila usando o Vite SWC, e as classes CSS aproveitam de forma eficiente a _Utility First rule_ do Tailwind.
- A Base de dados Prisma suporta _Cascading_ (Remoção Limpa) em tabelas relacionais de Viaturas para Reservas.

**Desenvolvido na Sessão de Programação AI - Março 2026**
