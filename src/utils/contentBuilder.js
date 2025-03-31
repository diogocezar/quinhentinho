/**
 * Create standardized incident content for Discord and GitHub
 * @param {Object} data - Incident data
 * @returns {Object} - Markdown content and embed content
 */
function createIncidentContent(data) {
  const {
    solicitante,
    date,
    prioridade,
    problema,
    cliente,
    identificacao,
    evidencias,
  } = data;

  // Build markdown content
  const markdownContent = `
## 📝 Solicitante  
**${solicitante}**  

## 📅 Data  
**${date}**  

## 🔥 Prioridade  
${prioridade}  

## ❓ O que aconteceu?  
${problema}  

## 🏢 Cliente(s) afetado(s)  
${cliente}  

## 🔍 Como identificar o cliente?  
${identificacao}  

## 📂 Evidências  
${
  evidencias ||
  "<Adicione links para uma pasta do Google Drive contendo prints, logs ou vídeos do incidente.>"
}  
`;

  // Create object with embed fields for Discord embeds if needed
  const embedContent = {
    solicitante,
    date,
    prioridade,
    problema,
    cliente,
    identificacao,
    evidencias: evidencias || "",
  };

  return { markdownContent, embedContent };
}

module.exports = { createIncidentContent };
