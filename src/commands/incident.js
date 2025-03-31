const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");

// Define the incident slash command
const incidentCommand = new SlashCommandBuilder()
  .setName("incident")
  .setDescription("Report a new incident");

// Create the modal for incident reporting
function createIncidentModal() {
  const modal = new ModalBuilder()
    .setCustomId("incidentModal")
    .setTitle("Report Incident");

  // Requester input
  const requesterInput = new TextInputBuilder()
    .setCustomId("requester")
    .setLabel("Requester")
    .setPlaceholder("Your full name")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Priority input
  const priorityInput = new TextInputBuilder()
    .setCustomId("priority")
    .setLabel("Priority")
    .setPlaceholder("LOW, MEDIUM or HIGH")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Problem description
  const problemInput = new TextInputBuilder()
    .setCustomId("problem")
    .setLabel("What happened?")
    .setPlaceholder("Describe the problem in detail...")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  // Affected client
  const clientInput = new TextInputBuilder()
    .setCustomId("client")
    .setLabel("Affected client(s)")
    .setPlaceholder(
      "Client name and identification (License Plate, ULID, ID, etc.)"
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Evidence
  const evidenceInput = new TextInputBuilder()
    .setCustomId("evidence")
    .setLabel("Evidence")
    .setPlaceholder("Links to Google Drive folder with screenshots, logs, etc.")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

  // Create action rows - Discord só permite 5 action rows por modal
  const requesterRow = new ActionRowBuilder().addComponents(requesterInput);
  const priorityRow = new ActionRowBuilder().addComponents(priorityInput);
  const problemRow = new ActionRowBuilder().addComponents(problemInput);
  const clientRow = new ActionRowBuilder().addComponents(clientInput);
  const evidenceRow = new ActionRowBuilder().addComponents(evidenceInput);

  // Add inputs to the modal - máximo de 5 componentes
  modal.addComponents(
    requesterRow,
    priorityRow,
    problemRow,
    clientRow,
    evidenceRow
  );

  return modal;
}

module.exports = {
  incidentCommand,
  createIncidentModal,
};
