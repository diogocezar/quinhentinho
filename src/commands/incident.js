const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");

// Define the incident slash command
const incidentCommand = new SlashCommandBuilder()
  .setName("incidente")
  .setDescription("Reportar um novo incidente");

// Create the modal for incident reporting
function createIncidentModal() {
  const modal = new ModalBuilder()
    .setCustomId("incidentModal")
    .setTitle("Reportar Incidente");

  // Requester input
  const requesterInput = new TextInputBuilder()
    .setCustomId("requester")
    .setLabel("Solicitante")
    .setPlaceholder("Seu nome completo")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Priority input
  const priorityInput = new TextInputBuilder()
    .setCustomId("priority")
    .setLabel("Prioridade")
    .setPlaceholder("BAIXA, MÉDIA ou ALTA")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Problem description
  const problemInput = new TextInputBuilder()
    .setCustomId("problem")
    .setLabel("O que aconteceu?")
    .setPlaceholder("Descreva detalhadamente o problema...")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  // Affected client
  const clientInput = new TextInputBuilder()
    .setCustomId("client")
    .setLabel("Cliente(s) afetado(s)")
    .setPlaceholder(
      "Nome do(s) cliente(s) e como identificá-los (Placa, ULID, ID, etc.)"
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Evidence
  const evidenceInput = new TextInputBuilder()
    .setCustomId("evidence")
    .setLabel("Evidências")
    .setPlaceholder("Links para pasta do Google Drive com prints, logs, etc.")
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
