#!/bin/bash

# Premium Terminal Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}       🚀 Inicialização - Rent-a-Car Premium         ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Exit immediately on error
set -e

echo -e "\n${YELLOW}[1/3] A iniciar o Backend API Core...${NC}"
cd backend
# Remover instância anterior em caso de re-start para evitar colisões
pm2 delete rentacar-api 2>/dev/null || true

# Iniciar backend a partir da compilação de produção
pm2 start dist/main.js --name "rentacar-api"
cd ..

echo -e "\n${YELLOW}[2/3] A iniciar o Frontend App (Servidor Autônomo)...${NC}"
cd frontend
pm2 delete rentacar-frontend 2>/dev/null || true

# Servir os binários de produção na porta 5173 como um Single Page App (SPA)
pm2 serve dist 5173 --name "rentacar-frontend" --spa
cd ..

echo -e "\n${YELLOW}[3/3] A guardar Auto-Reinicialização (Proteção contra reboots)...${NC}"
# Guarda a lista atual de processos para arrancar em caso de falha do servidor
pm2 save

echo -e "\n${GREEN}🏆 Sistema Rent-a-Car inicializado e em execução!${NC}"
echo -e "${CYAN}• Backend API :${NC} Online e protegido (PM2 Daemon)."
echo -e "${CYAN}• Frontend UI :${NC} http://localhost:5173 (ou através do IP Deste Servidor)."
echo -e "\nAbaixo o painel do controlo aéreo dos serviços:\n"

pm2 status
