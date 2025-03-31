#!/bin/bash

# Cores para mensagens
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Iniciando o Quinhentinho com Docker...${NC}"

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo -e "${BLUE}ℹ️  Criando .env.example como .env...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  Por favor, edite o arquivo .env com suas configurações antes de continuar.${NC}"
    exit 1
fi

# Construir e iniciar o container
docker-compose up -d --build

# Verificar se o contêiner está em execução
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Quinhentinho está sendo executado em segundo plano.${NC}"
    echo -e "${BLUE}ℹ️  Para ver os logs: ${NC}docker-compose logs -f"
    echo -e "${BLUE}ℹ️  Para parar: ${NC}docker-compose down"
else
    echo -e "${RED}❌ Falha ao iniciar o Quinhentinho.${NC}"
fi 