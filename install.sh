#!/bin/bash

# Premium Terminal Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}    🚀 Instalação e Migração - Rent-a-Car Premium    ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Exit immediately if a command exits with a non-zero status
set -e
trap 'echo -e "\n${RED}❌ Ocorreu um erro crítico durante a instalação. Verifique os logs acima.${NC}"; exit 1' ERR

echo -e "\n${YELLOW}[1/4] Verificando e instalando PM2 (Process Manager)...${NC}"
if ! command -v pm2 &> /dev/null
then
    echo "PM2 não encontrado. A instalar globalmente..."
    npm install -g pm2 serve
else
    echo "PM2 já está instalado no sistema. Ótimo!"
fi

echo -e "\n${YELLOW}[2/5] Configurando Variáveis de Ambiente (.env)...${NC}"
    rm -f backend/.env frontend/.env
    echo "A criar backend/.env a partir do .env.example..."
    cp .env.example backend/.env
    
    echo -e "${CYAN}Por favor, introduza a password do utilizador 'root' do MySQL deste servidor (deixe vazio se não tiver):${NC}"
    read -r -s DB_PASS
    echo ""
    
    if [ -n "$DB_PASS" ]; then
        sed -i "s/mysql:\/\/root:@localhost/mysql:\/\/root:${DB_PASS}@localhost/g" backend/.env
        echo "Password conectada ao Prisma via backend/.env!"
    else
        echo "A configurar Prisma para usar Unix Socket (Root sem password)..."
        sed -i "s/mysql:\/\/root:@localhost:3306\/rentacar/mysql:\/\/root@localhost\/rentacar?socket=\/var\/run\/mysqld\/mysqld.sock/g" backend/.env
    fi

    echo "A criar frontend/.env a partir do .env.example..."
    cp .env.example frontend/.env

echo -e "\n${YELLOW}[3/5] Configurando o Backend (NestJS + Prisma)...${NC}"
cd backend
echo "📦 A instalar dependências do NPM..."
npm install

echo "🗄️ A gerar Prisma Client..."
npx prisma generate

echo "🚀 A executar Migrations na base de dados (Criando esquemas)..."
# 'deploy' resolves all pending migrations without resetting the DB
npx prisma migrate deploy

echo "🌱 A popular base de dados inicial (Seed)..."
npm run prisma:seed

echo "🏗️ A compilar o Backend para Produção (Pode demorar uns instantes)..."
npm run build || true

if [ ! -f "dist/main.js" ]; then
    echo -e "${YELLOW}⚠️ 'nest build' falhou (Possível OOM). A usar fallback TSC nativo leve...${NC}"
    npx tsc
    
    # Resolver problema onde tsc cria dist/src/main.js devido ao ficheiro seed.ts
    if [ -f "dist/src/main.js" ]; then
        mv dist/src/* dist/
    fi
fi
cd ..

echo -e "\n${YELLOW}[4/5] Configurando o Frontend (React + Vite)...${NC}"
cd frontend
echo "📦 A instalar dependências do NPM..."
npm install

echo "🎨 A compilar Frontend App para Produção (Gerando assets óticos)..."
npm run build
cd ..

echo -e "\n${YELLOW}[5/5] Permissões de Script...${NC}"
chmod +x start.sh

echo -e "\n${GREEN}✅ Migração e Instalação concluídas com sucesso incomparável!${NC}"
echo -e "O ambiente está pronto. Execute ${BLUE}./start.sh${NC} para meter a frota na estrada."
