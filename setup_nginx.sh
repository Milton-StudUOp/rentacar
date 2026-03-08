#!/bin/bash
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}     🌐 Instalação Nginx - Rent-a-Car Premium        ${NC}"
echo -e "${BLUE}======================================================${NC}"

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Por favor, execute este comando como 'root' ou com 'sudo' (ex: sudo ./setup_nginx.sh)${NC}"
  exit 1
fi

echo -e "\n${YELLOW}[1/3] A verificar a instalação do Nginx...${NC}"
if ! command -v nginx &> /dev/null
then
    echo "Nginx não encontrado. A instalar Nginx Oficial (Ubuntu/Debian)..."
    apt-get update
    apt-get install -y nginx
else
    echo "Nginx já está instalado."
fi

echo -e "\n${YELLOW}[2/3] A configurar Host Remoto (Reverse Proxy)...${NC}"
echo -e "Introduza o IP público do seu servidor ou Domínio web (ex: rentacar.co.mz ou 192.168.1.100)."
echo -e "(Deixe vazio e pressione ENTER para ser o servidor padrão na internet):"
read -r SERVER_NAME

if [ -z "$SERVER_NAME" ]; then
    SERVER_NAME="_"
    echo "⚙️ Configurado como acesso padrão (Qualquer IP/Domínio)."
fi

cat > /etc/nginx/sites-available/rentacar << EOF
server {
    listen 80;
    server_name ${SERVER_NAME};

    # 🚀 Frontend SPA Application
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # 🔗 Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # 🖼️ Uploads de Imagens e Diretórios Estáticos
    location /uploads {
        proxy_pass http://localhost:3001/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}
EOF

echo -e "\n${YELLOW}[3/3] A Reiniciar e Ativar Portal Nginx...${NC}"
# Ligar site
ln -sf /etc/nginx/sites-available/rentacar /etc/nginx/sites-enabled/
# Desligar página default do nginx que o utilizador via
rm -f /etc/nginx/sites-enabled/default

# Rebotar serviço Nginx para ligar tudo!
nginx -t
systemctl restart nginx
systemctl enable nginx

echo -e "\n${GREEN}🏆 Nginx Premium perfeitamente configurado!${NC}"
if [ "$SERVER_NAME" == "_" ]; then
    echo -e "O teu Rent-a-Car está acessível online diretamente pelo IP deste servidor!"
else
    echo -e "O teu Rent-a-Car está acessível online em: http://${SERVER_NAME}/"
fi
