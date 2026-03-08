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

echo -e "Introduza o seu Domínio para SSL Grátis (ex: srv1468694.hstgr.cloud ou rentacar.co.mz)."
echo -e "(Deixe vazio e pressione ENTER se quiser usar apenas o IP sem cadeado SSL):"
read -r SERVER_NAME

HAS_DOMAIN=true
if [ -z "$SERVER_NAME" ]; then
    SERVER_NAME="_"
    HAS_DOMAIN=false
    echo "⚙️ Configurado apenas para acessos IP directos (Sem SSL)."
fi

cat > /etc/nginx/sites-available/rentacar << EOF
server {
    listen 80;
    server_name ${SERVER_NAME};

    # ⬆️ Permitir Uploads Grandes (ex: fotos de viaturas, comprovativos)
    client_max_body_size 50M;

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

    # 🖼️ Uploads de Imagens e Diretórios Estáticos (Servidos nativamente pelo Nginx)
    location /uploads/ {
        alias $(pwd)/backend/uploads/;
        autoindex off;
        access_log off;
        expires max;
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

echo -e "\n${GREEN}🏆 Nginx configurado com sucesso!${NC}"

if [ "$HAS_DOMAIN" = true ]; then
    echo -e "\n${YELLOW}[4/4] A Instalar e Gerar Certificado SSL (Cadeado Seguro)...${NC}"
    if ! command -v certbot &> /dev/null
    then
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    echo "A pedir certificado Let's Encrypt para ${SERVER_NAME}..."
    certbot --nginx -d ${SERVER_NAME} --non-interactive --agree-tos -m admin@${SERVER_NAME} --redirect
    
    echo -e "\n${GREEN}🔐 SSL Premium Ativado! O teu Rent-a-Car está acessível e 100% Seguro em: https://${SERVER_NAME}/${NC}"
else
    echo -e "\nO teu Rent-a-Car está acessível online via IP HTTP Direto!"
fi
