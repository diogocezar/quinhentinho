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
    console.log(chalk.green(`�� ${client.user.tag} is ready for use!`));
  });

  // Handle interactions (commands, buttons, modals)
  client.on(Events.InteractionCreate, async (interaction) => {
    try {
      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        // Handle /incident command
        if (interaction.commandName === "incident") {
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
      console.error(chalk.red("❌ Error processing interaction:"), error);

      // Reply to the user if possible
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content:
            "❌ An error occurred processing your command. Please try again later.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "❌ An error occurred processing your command. Please try again later.",
          ephemeral: true,
        });
      }
    }
  });
}

module.exports = { setupBot };
