PROMPT COMPLETO ATUALIZADO (copiar/colar)

Você é um engenheiro de software senior (full-stack) e vai entregar um sistema 100% funcional, rodando localmente sem erros, para uma plataforma web de Reservas de Rent-a-Car e Transfers em Moçambique.

1) Regra principal de acesso (muito importante)

A aplicação deve ser pública: Home, pesquisa, listagens e detalhes devem abrir sem login.

Somente para finalizar a reserva (viatura ou transfer), o utilizador deve:

Fazer login (se já tiver conta), OU

Fazer cadastro rápido no próprio checkout (se não tiver), e prosseguir imediatamente com a reserva.

O cadastro rápido deve ser curto e direto, com no mínimo:

Nome completo

Telefone (formato Moçambique)

Email (opcional, mas recomendado) OU telefone como identificador principal

Senha (ou “criar senha” rápida)

Após cadastro rápido:

Criar conta

Logar automaticamente (JWT + refresh)

Voltar ao checkout mantendo os dados preenchidos e concluir a reserva

1) Objetivo do sistema

Criar uma aplicação completa com:

Frontend: React (TypeScript) com UI moderna/premium, responsiva (mobile-first), UX forte.

Backend: Node.js (NestJS preferencial) com API REST.

Banco: MySQL 8+.

Autenticação: JWT + Refresh Token.

Perfis: Admin e Cliente.

Domínios do negócio: viaturas, transfers, reservas, disponibilidade e regiões (Moçambique).

1) Requisitos funcionais detalhados
3.1 Fluxo do Cliente (sem login até o checkout)

Público:

Landing page premium

Pesquisa de viaturas por região e datas

Detalhe de viatura

Pesquisa/Reserva de transfer por origem/destino/data/hora

Ao clicar em Reservar:

Abrir página/modal de Checkout

Mostrar 2 abas/botões bem claros:

Já tenho conta → Login

Quero reservar rápido → Cadastro rápido

Regras do Checkout:

Se já estiver logado, não mostrar login/cadastro.

Se não estiver logado, forçar escolher login ou cadastro rápido.

Depois de autenticar, continuar no mesmo checkout e concluir.

Conta do cliente:

Minhas reservas

Detalhe da reserva

Cancelamento conforme política

Mensagens e UX:

Loading states

Toasts de sucesso/erro

Erros amigáveis e claros

3.2 Área do Administrador (login obrigatório)

O Admin deve poder:

Login/Logout

CRUD viaturas (com custos completos + imagens)

Associar viaturas a regiões de Moçambique (província/cidade/área)

Definir disponibilidade por calendário e bloqueios

CRUD transfers (serviços/rotas/preços/horários)

Gestão de reservas (listar, ver detalhe, aprovar/confirmar, cancelar)

Dashboard com KPIs

1) Autenticação e permissões (obrigatório)

Cliente: criado por cadastro rápido ou cadastro normal

Admin: criado via seed inicial

Endpoints protegidos:

Admin: tudo do painel admin

Cliente: “minhas reservas”, criar reserva, detalhes do próprio utilizador

Fluxo de checkout:

Reservas só podem ser criadas por utilizador autenticado (cliente)

Para UX, permitir “pré-reserva” no frontend (estado local) e só envia ao backend após autenticar

1) Regras de disponibilidade e conflitos

Viaturas:

Não permitir reservas confirmadas com intervalos sobrepostos

Validar disponibilidade cadastrada pelo admin (calendário)

Bloquear automaticamente datas ao confirmar reserva

Transfers:

Validar janela de horário e capacidade

1) Stack obrigatória

Frontend:

React + TypeScript + Vite

TailwindCSS

React Router

TanStack Query

React Hook Form + Zod

UI premium (shadcn/ui ou Material UI) mantendo estética consistente

Backend:

NestJS (preferencial) OU Express com arquitetura limpa

Prisma (preferencial) + MySQL

Docker Compose:

mysql

backend

frontend

(opcional) phpMyAdmin

1) Modelo de dados (mínimo)

Inclua tabelas:

users (role: ADMIN/CLIENT)

regions (província/cidade/área)

vehicles

vehicle_images

vehicle_region (N:N)

vehicle_availability (data/status/motivo)

transfer_services

transfer_routes

bookings (tipo VEHICLE/TRANSFER, status)

vehicle_bookings

transfer_bookings

payments (opcional)

1) Entregáveis obrigatórios

Você vai entregar tudo pronto:

Código completo frontend e backend

docker-compose.yml funcional

.env.example

Migrações + seed (inclui admin default e regiões de Moçambique + exemplos)

README com passos para rodar

Credenciais default do admin

Coleção Postman/Insomnia

Lista de endpoints + exemplos

1) Páginas obrigatórias

Público:

Home

Listagem viaturas + filtros

Detalhe viatura

Transfer busca + detalhe

Checkout reserva (com login/cadastro rápido embutido)

Cliente:

Minhas reservas

Perfil

Admin:

Dashboard

Viaturas (lista/criar/editar)

Disponibilidade (calendário)

Transfers
z
Reservas

1) Regras anti-projeto-incompleto

Não omitir arquivos por brevidade

Sem pseudo-código

Sem TODOs

Deve compilar e rodar

Incluir seeds e dados de exemplo

Implementar validações e tratamento de erros padronizado

Agora gere o projeto completo com todos os arquivos e um README final com instruções passo a passo para rodar localmente via Docker, e teste de fluxo: visitante → selecionar viatura → checkout → cadastro rápido → confirmar reserva.
