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
## 📝 Requester  
**${requester}**  

## 📅 Date  
**${date}**  

## 🔥 Priority  
${priority}  

## ❓ What happened?  
${problem}  

## 🏢 Affected client(s)  
${client}  

## 🔍 How to identify the client?  
${identification}  

## 📂 Evidence  
${
  evidence ||
  "<Add links to Google Drive folder containing screenshots, logs or videos of the incident.>"
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
