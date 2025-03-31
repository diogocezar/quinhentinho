# 🤖 Quinhentinho - Bot Coletor de Incidentes

Sou o Quinhentinho, seu humilde coletor de incidentes! Se deu ruim, me chama. Se foi culpa sua… também me chama. 🔥🤖

## 📋 Funcionalidades

- 📝 Cria formulários modais no Discord para reportar incidentes
- 🧵 Abre automaticamente tópicos no canal configurado
- 🐙 Cria issues no GitHub para cada incidente reportado
- 📊 Adiciona os incidentes a um projeto do GitHub

## 🚀 Instalação

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/quinhentinho.git
cd quinhentinho
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env` e preencha as variáveis:
```bash
cp .env.example .env
```

## ⚙️ Configuração

### 1. Criando um Bot no Discord

1. Acesse o [Portal de Desenvolvedores do Discord](https://discord.com/developers/applications)
2. Clique em "New Application" e dê um nome (ex: Quinhentinho)
3. Na seção "Bot", clique em "Add Bot"
4. Desative a opção "Public Bot" se não quiser que outros usuários possam adicionar seu bot
5. Em "Privileged Gateway Intents", ative:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
6. Clique em "Save Changes"
7. Copie o "TOKEN" do bot e adicione ao seu arquivo `.env` como `DISCORD_TOKEN`
8. Na seção "OAuth2 > URL Generator", selecione os seguintes escopos:
   - `bot`
   - `applications.commands`
9. Em permissões do bot, selecione:
   - Manage Threads
   - Send Messages
   - Create Public Threads
   - Embed Links
   - Attach Files
   - Read Message History
   - Use Slash Commands
10. Copie a URL gerada e abra em seu navegador para adicionar o bot ao seu servidor
11. Copie o ID da aplicação para a variável `DISCORD_CLIENT_ID` no arquivo `.env`
12. Copie o ID do seu servidor Discord para a variável `DISCORD_GUILD_ID` no `.env`
13. Copie o ID do canal onde os incidentes serão criados para a variável `DISCORD_INCIDENTS_CHANNEL_ID` no `.env`

### 2. Configurando o GitHub

1. Acesse [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token" > "Generate new token (classic)"
3. Adicione uma nota descritiva (ex: Quinhentinho Bot)
4. Selecione os seguintes escopos:
   - `repo` (para acesso completo aos repositórios)
   - `project` (para acesso aos projetos)
5. Clique em "Generate token" e copie o token gerado
6. Adicione o token ao seu arquivo `.env` como `GITHUB_TOKEN`
7. Preencha as outras variáveis do GitHub no `.env`:
   - `GITHUB_OWNER`: seu nome de usuário ou organização
   - `GITHUB_REPO`: nome do repositório onde as issues serão criadas
   - `GITHUB_PROJECT_NUMBER`: número do projeto do GitHub (o número que aparece na URL)
   - `GITHUB_PROJECT_TYPE`: tipo do projeto, use `user` para projetos pessoais ou `org` para projetos de organizações

Para obter o número do projeto:
1. Abra seu projeto no GitHub
2. Observe a URL, por exemplo: `https://github.com/users/username/projects/1`
3. O número do projeto é o último número da URL (no exemplo: 1)
4. Configure `GITHUB_PROJECT_NUMBER=1` no seu arquivo `.env`

## 🚀 Uso

1. Registre os comandos slash no Discord:
```bash
npm run register
```

2. Inicie o bot:
```bash
npm start
```

Para desenvolvimento com restart automático:
```bash
npm run dev
```

## 📝 Comandos

O bot oferece o seguinte comando slash no Discord:

- `/incidente` - Abre um formulário para reportar um novo incidente

## 🧩 Estrutura do Projeto

```
quinhentinho/
├── src/
│   ├── bot/
│   │   ├── handlers/
│   │   │   └── incidentHandler.js  # Processamento de incidentes
│   │   └── setup.js                # Configuração do bot
│   ├── commands/
│   │   ├── incident.js             # Comando /incidente
│   │   └── register.js             # Registro de comandos slash
│   ├── services/
│   │   └── github.js               # Integração com GitHub
│   ├── utils/
│   │   └── contentBuilder.js       # Construção de mensagens
│   └── index.js                    # Ponto de entrada principal
├── .env.example                    # Exemplo de variáveis de ambiente
├── package.json                    # Dependências e scripts
└── README.md                       # Documentação
```

## 📄 Licença

Este projeto está licenciado sob a licença ISC.

## 🐳 Docker

Para facilitar a execução e implantação, você pode usar Docker:

### Usando os scripts auxiliares

1. Inicie o bot:
```bash
./start.sh
```

2. Pare o bot:
```bash
./stop.sh
```

### Comandos Docker manuais

1. Construa e inicie o contêiner:
```bash
docker-compose up -d --build
```

2. Visualize os logs:
```bash
docker-compose logs -f
```

3. Pare o contêiner:
```bash
docker-compose down
```
