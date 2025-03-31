FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"] 