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

  // Solicitante input
  const solicitanteInput = new TextInputBuilder()
    .setCustomId("solicitante")
    .setLabel("Solicitante")
    .setPlaceholder("Seu nome completo")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Prioridade input
  const prioridadeInput = new TextInputBuilder()
    .setCustomId("prioridade")
    .setLabel("Prioridade")
    .setPlaceholder("BAIXA, MÉDIA ou ALTA")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Descrição do problema
  const problemaInput = new TextInputBuilder()
    .setCustomId("problema")
    .setLabel("O que aconteceu?")
    .setPlaceholder("Descreva detalhadamente o problema...")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  // Cliente afetado
  const clienteInput = new TextInputBuilder()
    .setCustomId("cliente")
    .setLabel("Cliente(s) afetado(s)")
    .setPlaceholder("Nome do(s) cliente(s)")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Identificação do cliente
  const identificacaoInput = new TextInputBuilder()
    .setCustomId("identificacao")
    .setLabel("Como identificar o cliente?")
    .setPlaceholder("Placa, ULID, ID do dispositivo, etc.")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Create action rows
  const solicitanteRow = new ActionRowBuilder().addComponents(solicitanteInput);
  const prioridadeRow = new ActionRowBuilder().addComponents(prioridadeInput);
  const problemaRow = new ActionRowBuilder().addComponents(problemaInput);
  const clienteRow = new ActionRowBuilder().addComponents(clienteInput);
  const identificacaoRow = new ActionRowBuilder().addComponents(
    identificacaoInput
  );

  // Add inputs to the modal
  modal.addComponents(
    solicitanteRow,
    prioridadeRow,
    problemaRow,
    clienteRow,
    identificacaoRow
  );

  return modal;
}

module.exports = {
  incidentCommand,
  createIncidentModal,
};
