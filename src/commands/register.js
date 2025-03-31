const { REST, Routes } = require("discord.js");
const chalk = require("chalk");
const { incidentCommand } = require("./incident");

/**
 * Register all slash commands with Discord API
 */
async function registerCommands() {
  const commands = [incidentCommand.toJSON()];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(chalk.yellow("🔄 Iniciando registro de comandos..."));

    // Register commands for a specific guild (server) - faster for development
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log(chalk.green("✅ Comandos registrados com sucesso!"));
  } catch (error) {
    console.error(chalk.red("❌ Erro ao registrar comandos:"), error);
    throw error;
  }
}

module.exports = { registerCommands };
