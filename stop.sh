#!/bin/bash

# Cores para mensagens
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Parando o Quinhentinho...${NC}"

# Parar o container
docker-compose down

# Verificar se o contêiner foi parado
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Quinhentinho foi parado com sucesso.${NC}"
else
    echo -e "${RED}❌ Falha ao parar o Quinhentinho.${NC}"
fi 