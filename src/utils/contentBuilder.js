/**
 * Create standardized incident content for Discord and GitHub
 * @param {Object} data - Incident data
 * @returns {Object} - Markdown content and embed content
 */
function createIncidentContent(data) {
  const {
    requester,
    date,
    priority,
    problem,
    client,
    identification,
    evidence,
  } = data;

  // Build markdown content
  const markdownContent = `
## 📝 Solicitante  
**${requester}**  

## 📅 Data  
**${date}**  

## 🔥 Prioridade  
${priority}  

## ❓ O que aconteceu?  
${problem}  

## 🏢 Cliente(s) afetado(s)  
${client}  

## 🔍 Como identificar o cliente?  
${identification}  

## 📂 Evidências  
${
  evidence ||
  "<Adicione links para uma pasta do Google Drive contendo prints, logs ou vídeos do incidente.>"
}  
`;

  // Create object with embed fields for Discord embeds if needed
  const embedContent = {
    requester,
    date,
    priority,
    problem,
    client,
    identification,
    evidence: evidence || "",
  };

  return { markdownContent, embedContent };
}

module.exports = { createIncidentContent };
