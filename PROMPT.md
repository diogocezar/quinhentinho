# Contexto

Essa aplicação é chamada de "Quinhentinho" um bot do discord que servirá para coletar e organizar os incidentes reportados na empresa que trabalho.

**PROBLEMA**: Atualmente os usuários do discord precisam criar um incidente de forma manual (abrindo um novo tópico, e seguindo um template) e tudo isso fica bagunçado e desorganizado, as vezes as pessoas esquecem de fazer isso da forma correta e seguindo os padrões.

# O que deve ser feito?

Deve-se criar um programa CLI em Node.js, que suba o Bot no Discord para que todo este processo seja solicitado diretamente ao Bot.

1. Deve-se utilizar Modais para coletar as informações que vão criar o incidente;
2. Todo novo incidente aberto (pelo formulário), deve abrir automaticamente um Tópico em um canal específico de incidentes;
3. Ao mesmo tempo, deve-se criar uma issue em um projeto específico no GitHub que deverá guardar os incidentes.
4. Deve-se então incluir este incidente em uma coluna em um Projeto do GitHub em questão.

Utilize o seguinte tempalte para a criação dos incidentes:

```
## 📝 Solicitante  
**Diogo Cezar**  

## 📅 Data  
**15/02/2025**  

## 🔥 Prioridade  
[🟢 BAIXA | 🟡 MÉDIA | 🔴 ALTA]  

## ❓ O que aconteceu?  
<Descreva detalhadamente o motivo desta solicitação, incluindo contexto e impacto.>  

## 🏢 Cliente(s) afetado(s)  
<Nome do(s) cliente(s)>  

## 🔍 Como identificar o cliente?  
<Placa, ULID, ID do dispositivo, etc.>  

## 📂 Evidências  
<Adicione links para uma pasta do Google Drive contendo prints, logs ou vídeos do incidente.>  
```

A criação do título do tópico no Discord deve seguir o padrão

```
📌 [DATA] CLIENTE - PROBLEMA
```

A criação do título da issue no GitHub deve ser:

```
🐙 [INCIDENT] (DATA) - CLIENTE - PROBLEMA
```

Você pode criar um padrão 

# Regras

- Utilize um arquivo de `.env` para as credenciais necessárias para o Discord e GitHub;
- Faça implementações simples, diretas e objetivas;
- Utilize emojis e logs para mostrar o passo a passo das execuções;
- Utilize Markdown nas mensagens enviadas para o canal e criadas no GitHub (utilize emojis);

# Explicações

- Crie um README.md com um passo a passo para configurar e executar o programa;
- Não se esqueça de incluir o passo a passo de como criar e configurar o Bot;