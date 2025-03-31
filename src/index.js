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
  .description("Discord bot to collect and organize incidents")
  .version("1.0.0");

program
  .command("start")
  .description("Start the Discord bot")
  .action(async () => {
    console.log(chalk.blue("🤖 Starting Quinhentinho..."));

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
      console.log(chalk.green("✅ Bot connected to Discord successfully!"));
    } catch (error) {
      console.error(chalk.red("❌ Error connecting the bot:"), error);
      process.exit(1);
    }
  });

program
  .command("register")
  .description("Register slash commands in Discord")
  .action(async () => {
    console.log(chalk.blue("🔄 Registering slash commands..."));

    try {
      await registerCommands();
      console.log(chalk.green("✅ Commands registered successfully!"));
    } catch (error) {
      console.error(chalk.red("❌ Error registering commands:"), error);
      process.exit(1);
    }
  });

program.parse(process.argv);
