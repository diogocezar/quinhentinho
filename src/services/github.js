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
      labels: ["incident"],
    });

    console.log(chalk.green(`✅ Issue criada: ${issue.html_url}`));

    // Tentar adicionar a issue ao projeto, mas não falhar se der erro
    try {
      // Verificar se temos todas as informações de projeto necessárias
      if (process.env.GITHUB_PROJECT_NUMBER) {
        // Verificar se o token tem os escopos necessários
        const scopes = await checkTokenScopes();

        if (
          scopes.includes("project") ||
          scopes.includes("read:project") ||
          scopes.includes("write:project")
        ) {
          await addIssueToProject(issue.node_id);
        } else {
          console.log(
            chalk.yellow(
              "⚠️ Token GitHub não tem permissões de projeto (project, read:project, write:project)."
            )
          );
          console.log(
            chalk.yellow(
              "⚠️ A issue não será adicionada ao projeto. Adicione manualmente ou atualize seu token."
            )
          );
        }
      } else {
        console.log(
          chalk.yellow(
            "⚠️ Configuração do projeto GitHub incompleta. A issue não será adicionada ao projeto."
          )
        );
      }
    } catch (projectError) {
      // Não falhar completamente, apenas logar o erro
      console.log(
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

// Verificar os escopos do token GitHub
async function checkTokenScopes() {
  try {
    const { headers } = await octokit.request("GET /");
    const scopes = headers["x-oauth-scopes"] || "";
    return scopes.split(", ");
  } catch (error) {
    console.error(
      chalk.red("❌ Erro ao verificar permissões do token:"),
      error
    );
    return [];
  }
}

/**
 * Obtém o ID do projeto e da coluna de destino
 * @returns {Promise<Object>} - IDs do projeto e da coluna
 */
async function getProjectInfo(incidentsColumnName) {
  try {
    // Primeiro obter o ID do projeto
    const projectQuery = `
      query {
        organization(login: "${process.env.GITHUB_OWNER}") {
          projectV2(number: ${process.env.GITHUB_PROJECT_NUMBER}) {
            id
            fields(first: 20) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const projectData = await octokit.graphql(projectQuery);
    const projectId = projectData.organization.projectV2.id;

    // Encontrar o campo de status e o valor "☠️ INCIDENTS"
    let statusFieldId = null;
    let incidentesOptionId = null;

    const fields = projectData.organization.projectV2.fields.nodes;
    for (const field of fields) {
      if (field.name === "Status") {
        statusFieldId = field.id;
        for (const option of field.options) {
          if (option.name === incidentsColumnName) {
            incidentesOptionId = option.id;
            break;
          }
        }
        break;
      }
    }

    return {
      projectId,
      statusFieldId,
      incidentesOptionId,
    };
  } catch (error) {
    console.error(chalk.red("❌ Erro ao obter informações do projeto:"), error);
    throw error;
  }
}

/**
 * Add an issue to a GitHub project and place it in the INCIDENTES column
 * @param {string} issueNodeId - Node ID of the issue
 */
async function addIssueToProject(issueNodeId) {
  try {
    console.log(chalk.blue("📋 Adicionando issue ao projeto..."));

    // Obter o nome da coluna de incidentes da variável de ambiente ou usar o valor padrão
    const incidentsColumnName =
      process.env.GITHUB_INCIDENTS_COLUMN_NAME || "☠️ INCIDENTS";

    // Obter informações do projeto
    const { projectId, statusFieldId, incidentesOptionId } =
      await getProjectInfo(incidentsColumnName);

    // Adicionar a issue ao projeto
    const addItemMutation = `
      mutation {
        addProjectV2ItemById(input: {
          projectId: "${projectId}"
          contentId: "${issueNodeId}"
        }) {
          item {
            id
          }
        }
      }
    `;

    const addResponse = await octokit.graphql(addItemMutation);
    const itemId = addResponse.addProjectV2ItemById.item.id;

    console.log(chalk.green("✅ Issue adicionada ao projeto com sucesso!"));

    // Se encontramos o campo de status e o valor INCIDENTES, mover o card para essa coluna
    if (statusFieldId && incidentesOptionId) {
      console.log(
        chalk.blue(`🔄 Movendo issue para a coluna "${incidentsColumnName}"...`)
      );

      const updateItemMutation = `
        mutation {
          updateProjectV2ItemFieldValue(input: {
            projectId: "${projectId}"
            itemId: "${itemId}"
            fieldId: "${statusFieldId}"
            value: { 
              singleSelectOptionId: "${incidentesOptionId}"
            }
          }) {
            projectV2Item {
              id
            }
          }
        }
      `;

      await octokit.graphql(updateItemMutation);
      console.log(
        chalk.green(
          `✅ Issue movida para a coluna "${incidentsColumnName}" com sucesso!`
        )
      );
    } else {
      console.log(
        chalk.yellow(
          `⚠️ Não foi possível localizar a coluna "${incidentsColumnName}" no projeto.`
        )
      );
    }

    return itemId;
  } catch (error) {
    console.error(chalk.red("❌ Erro ao adicionar issue ao projeto:"), error);
    throw error;
  }
}

module.exports = {
  createGitHubIssue,
  addIssueToProject,
};
