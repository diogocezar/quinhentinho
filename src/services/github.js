const { Octokit } = require("octokit");
const chalk = require("chalk");

// Initialize Octokit with GitHub token
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Create a GitHub issue for an incident
 * @param {string} title - Issue title
 * @param {string} body - Issue body in markdown
 * @returns {string} - URL of the created issue
 */
async function createGitHubIssue(title, body) {
  try {
    console.log(chalk.blue("🐙 Criando issue no GitHub..."));

    // Create the issue
    const { data: issue } = await octokit.rest.issues.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      title,
      body,
      labels: ["incidente", "bug"],
    });

    console.log(chalk.green(`✅ Issue criada: ${issue.html_url}`));

    // Add the issue to the project
    try {
      await addIssueToProject(issue.node_id);
    } catch (projectError) {
      console.error(
        chalk.yellow(
          `⚠️ Não foi possível adicionar a issue ao projeto: ${projectError.message}`
        )
      );
    }

    return issue.html_url;
  } catch (error) {
    console.error(chalk.red("❌ Erro ao criar issue no GitHub:"), error);
    throw new Error(`Falha ao criar issue no GitHub: ${error.message}`);
  }
}

/**
 * Add an issue to a GitHub project
 * @param {string} issueNodeId - Node ID of the issue
 */
async function addIssueToProject(issueNodeId) {
  try {
    console.log(chalk.blue("📋 Adicionando issue ao projeto..."));

    // The GraphQL mutation to add an item to a project
    const mutation = `
      mutation {
        addProjectV2ItemById(input: {
          projectId: "${process.env.GITHUB_PROJECT_ID}"
          contentId: "${issueNodeId}"
        }) {
          item {
            id
          }
        }
      }
    `;

    // Execute the GraphQL mutation
    const response = await octokit.graphql(mutation);

    console.log(chalk.green("✅ Issue adicionada ao projeto com sucesso!"));
    return response;
  } catch (error) {
    console.error(chalk.red("❌ Erro ao adicionar issue ao projeto:"), error);
    throw error;
  }
}

module.exports = {
  createGitHubIssue,
  addIssueToProject,
};
