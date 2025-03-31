const { Events } = require("discord.js");
const chalk = require("chalk");
const { createIncidentModal } = require("../commands/incident");
const { handleIncidentSubmission } = require("./handlers/incidentHandler");

/**
 * Set up Discord bot event handlers
 * @param {Client} client - Discord.js client
 */
function setupBot(client) {
  // Log when the bot is ready
  client.once(Events.ClientReady, () => {
    console.log(chalk.green(`🤖 ${client.user.tag} está pronto para uso!`));
  });

  // Handle interactions (commands, buttons, modals)
  client.on(Events.InteractionCreate, async (interaction) => {
    try {
      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        // Handle /incident command
        if (interaction.commandName === "incidente") {
          const modal = createIncidentModal();
          await interaction.showModal(modal);
        }
      }

      // Handle modal submissions
      if (interaction.isModalSubmit()) {
        if (interaction.customId === "incidentModal") {
          await handleIncidentSubmission(interaction);
        }
      }
    } catch (error) {
      console.error(chalk.red("❌ Erro ao processar interação:"), error);

      // Reply to the user if possible
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content:
            "❌ Ocorreu um erro ao processar seu comando. Por favor, tente novamente mais tarde.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "❌ Ocorreu um erro ao processar seu comando. Por favor, tente novamente mais tarde.",
          ephemeral: true,
        });
      }
    }
  });
}

module.exports = { setupBot };
