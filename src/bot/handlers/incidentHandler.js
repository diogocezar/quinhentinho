const { ThreadChannel, EmbedBuilder } = require("discord.js");
const { format } = require("date-fns");
const { Octokit } = require("octokit");
const chalk = require("chalk");
const { createIncidentContent } = require("../../utils/contentBuilder");
const { createGitHubIssue } = require("../../services/github");

/**
 * Handle incident modal submission
 * @param {ModalSubmitInteraction} interaction - Discord modal submission interaction
 */
async function handleIncidentSubmission(interaction) {
  try {
    // Acknowledge the interaction
    await interaction.deferReply({ ephemeral: true });

    console.log(chalk.blue("📝 Processando novo incidente..."));

    // Get form values
    const solicitante = interaction.fields.getTextInputValue("solicitante");
    const prioridade = interaction.fields
      .getTextInputValue("prioridade")
      .toUpperCase();
    const problema = interaction.fields.getTextInputValue("problema");
    const cliente = interaction.fields.getTextInputValue("cliente");
    const identificacao = interaction.fields.getTextInputValue("identificacao");

    // Get current date
    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd/MM/yyyy");
    const dateForTitle = format(currentDate, "dd-MM-yyyy");

    // Validate priority
    let prioridadeEmoji = "🟢";
    if (prioridade === "MÉDIA" || prioridade === "MEDIA") {
      prioridadeEmoji = "🟡";
    } else if (prioridade === "ALTA") {
      prioridadeEmoji = "🔴";
    }

    // Create title for Discord thread and GitHub issue
    const discordTitle = `📌 [${dateForTitle}] ${cliente} - ${problema.substring(
      0,
      50
    )}${problema.length > 50 ? "..." : ""}`;
    const gitHubTitle = `🐙 [FIX] (${dateForTitle}) - ${cliente} - ${problema.substring(
      0,
      50
    )}${problema.length > 50 ? "..." : ""}`;

    // Build content for Discord thread and GitHub issue
    const contentData = {
      solicitante,
      date: formattedDate,
      prioridade: `[${prioridadeEmoji} ${prioridade}]`,
      problema,
      cliente,
      identificacao,
      evidencias: "",
    };

    // Create content
    const { markdownContent, embedContent } =
      createIncidentContent(contentData);

    // Get incidents channel
    const incidentsChannel = await interaction.client.channels.fetch(
      process.env.DISCORD_INCIDENTS_CHANNEL_ID
    );

    // Create thread in Discord
    console.log(chalk.yellow("🧵 Criando tópico no Discord..."));
    const thread = await incidentsChannel.threads.create({
      name: discordTitle,
      autoArchiveDuration: 10080, // 1 week
      reason: `Incidente reportado por ${solicitante}`,
    });

    // Send content to thread
    await thread.send({ content: markdownContent });

    // Create GitHub issue
    console.log(chalk.yellow("🐙 Criando issue no GitHub..."));
    const issueUrl = await createGitHubIssue(gitHubTitle, markdownContent);

    // Send a confirmation message with the issue URL
    await thread.send({
      content: `🔗 **Issue criada no GitHub:** ${issueUrl}\n\n⚠️ *Lembre-se de adicionar as evidências conforme necessário.*`,
    });

    // Reply to the interaction
    await interaction.editReply({
      content: `✅ Incidente registrado com sucesso!\n🧵 Um novo tópico foi criado no canal <#${process.env.DISCORD_INCIDENTS_CHANNEL_ID}>.\n🐙 Uma issue foi criada no GitHub: ${issueUrl}`,
      ephemeral: true,
    });

    console.log(chalk.green("✅ Incidente processado com sucesso!"));
  } catch (error) {
    console.error(chalk.red("❌ Erro ao processar incidente:"), error);

    // Reply with error
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content:
          "❌ Ocorreu um erro ao processar o incidente. Por favor, tente novamente mais tarde.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content:
          "❌ Ocorreu um erro ao processar o incidente. Por favor, tente novamente mais tarde.",
        ephemeral: true,
      });
    }
  }
}

module.exports = { handleIncidentSubmission };
