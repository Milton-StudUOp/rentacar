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

echo -e "\n${YELLOW}[2/4] Configurando o Backend (NestJS + Prisma)...${NC}"
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

echo "🏗️ A compilar o Backend para Produção..."
npm run build
cd ..

echo -e "\n${YELLOW}[3/4] Configurando o Frontend (React + Vite)...${NC}"
cd frontend
echo "📦 A instalar dependências do NPM..."
npm install

echo "🎨 A compilar Frontend App para Produção (Gerando assets óticos)..."
npm run build
cd ..

echo -e "\n${YELLOW}[4/4] Permissões de Script...${NC}"
chmod +x start.sh

echo -e "\n${GREEN}✅ Migração e Instalação concluídas com sucesso incomparável!${NC}"
echo -e "O ambiente está pronto. Execute ${BLUE}./start.sh${NC} para meter a frota na estrada."
