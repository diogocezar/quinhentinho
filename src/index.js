#!/usr/bin/env node

require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { Command } = require("commander");
const chalk = require("chalk");
const { registerCommands } = require("./commands/register");
const { setupBot } = require("./bot/setup");

const program = new Command();

// Set up CLI options
program
  .name("quinhentinho")
  .description("Bot do Discord para coletar e organizar incidentes")
  .version("1.0.0");

program
  .command("start")
  .description("Iniciar o bot do Discord")
  .action(async () => {
    console.log(chalk.blue("🤖 Iniciando o Quinhentinho..."));

    // Create Discord client
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Channel],
    });

    // Set up event handlers and commands
    setupBot(client);

    // Login to Discord
    try {
      await client.login(process.env.DISCORD_TOKEN);
      console.log(chalk.green("✅ Bot conectado ao Discord com sucesso!"));
    } catch (error) {
      console.error(chalk.red("❌ Erro ao conectar o bot:"), error);
      process.exit(1);
    }
  });

program
  .command("register")
  .description("Registrar comandos slash no Discord")
  .action(async () => {
    console.log(chalk.blue("🔄 Registrando comandos slash..."));

    try {
      await registerCommands();
      console.log(chalk.green("✅ Comandos registrados com sucesso!"));
    } catch (error) {
      console.error(chalk.red("❌ Erro ao registrar comandos:"), error);
      process.exit(1);
    }
  });

program.parse(process.argv);
