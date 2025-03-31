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
    const requester = interaction.fields.getTextInputValue("requester");
    const priority = interaction.fields
      .getTextInputValue("priority")
      .toUpperCase();
    const problem = interaction.fields.getTextInputValue("problem");
    const clientFull = interaction.fields.getTextInputValue("client");
    const evidence = interaction.fields.getTextInputValue("evidence") || "";

    // Separar o nome do cliente e a identificação, se possível
    let client = clientFull;
    let identification = "";

    // Tentar extrair informações de identificação
    if (clientFull.includes("(")) {
      const match = clientFull.match(/(.*?)\s*\((.*?)\)/);
      if (match) {
        client = match[1].trim();
        identification = match[2].trim();
      }
    } else if (clientFull.includes(":")) {
      const parts = clientFull.split(":");
      client = parts[0].trim();
      identification = parts[1].trim();
    } else if (clientFull.includes("-")) {
      const parts = clientFull.split("-");
      client = parts[0].trim();
      identification = parts[1].trim();
    }

    // Get current date
    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd/MM/yyyy");
    const dateForTitle = format(currentDate, "dd-MM-yyyy");

    // Validate priority
    let priorityEmoji = "🟢";
    if (priority === "MEDIUM" || priority === "MÉDIA" || priority === "MEDIA") {
      priorityEmoji = "🟡";
    } else if (priority === "HIGH" || priority === "ALTA") {
      priorityEmoji = "🔴";
    }

    // Create title for Discord thread and GitHub issue
    const discordTitle = `📌 [${dateForTitle}] ${client} - ${problem.substring(
      0,
      50
    )}${problem.length > 50 ? "..." : ""}`;
    const gitHubTitle = `🐙 [FIX] (${dateForTitle}) - ${client} - ${problem.substring(
      0,
      50
    )}${problem.length > 50 ? "..." : ""}`;

    // Build content for Discord thread and GitHub issue
    const contentData = {
      requester,
      date: formattedDate,
      priority: `[${priorityEmoji} ${priority}]`,
      problem,
      client,
      identification,
      evidence,
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
      reason: `Incidente reportado por ${requester}`,
    });

    // Send content to thread
    await thread.send({ content: markdownContent });

    // Create GitHub issue
    console.log(chalk.yellow("🐙 Criando issue no GitHub..."));
    const issueUrl = await createGitHubIssue(gitHubTitle, markdownContent);

    // Send a confirmation message with the issue URL
    await thread.send({
      content: evidence
        ? `🔗 **Issue criada no GitHub:** ${issueUrl}`
        : `🔗 **Issue criada no GitHub:** ${issueUrl}\n\n⚠️ *Lembre-se de adicionar as evidências conforme necessário.*`,
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
