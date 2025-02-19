import { Command } from 'commander';
import { upsertEntity } from './port_client';
import { getIssues, getRepositories } from './aikido_client';

if (process.env.GITHUB_ACTIONS !== 'true') {
    require('dotenv').config();
}

async function main() {
  const PORT_CLIENT_ID = process.env.PORT_CLIENT_ID;
  const PORT_CLIENT_SECRET = process.env.PORT_CLIENT_SECRET;
  const AIKIDO_CLIENT_ID = process.env.AIKIDO_CLIENT_ID;
  const AIKIDO_CLIENT_SECRET = process.env.AIKIDO_CLIENT_SECRET;

  if (!PORT_CLIENT_ID || !PORT_CLIENT_SECRET || !AIKIDO_CLIENT_ID || !AIKIDO_CLIENT_SECRET) {
    console.log('Please provide env vars PORT_CLIENT_ID, PORT_CLIENT_SECRET, AIKIDO_CLIENT_ID and AIKIDO_CLIENT_SECRET');
    process.exit(0);
  }

  try {
    const program = new Command();

    program
      .name('aikido-integration')
      .description('CLI to interact with aikido');

    program
      .command('fetch-issues')
      .description('Get Aikido Issues')
      .action(async () => {
        console.log('fetching issues')
        const issues = await getIssues();
        for (const issue of issues) {
          console.log(issue);
            await upsertEntity('aikido_issue', issue.id.toString(), issue.id.toString(), {
              group_id: issue.group_id,
              attack_surface: issue.attack_surface,
              status: issue.status,
              severity: issue.severity,
              severity_score: issue.severity_score,
              type: issue.type,
              rule: issue.rule,
              rule_id: issue.rule_id,
              affected_package: issue.affected_package,
              affected_file: issue.affected_file,
              first_detected_at: issue.first_detected_at,
              code_repo_name: issue.code_repo_name,
              container_repo_id: issue.container_repo_id,
              container_repo_name: issue.container_repo_name,
              sla_days: issue.sla_days,
              sla_remediate_by: issue.sla_remediate_by,
              ignored_at: issue.ignored_at,
              ignored_by: issue.ignored_by,
              closed_at: issue.closed_at

            }, {
              aikido_repository: issue.code_repo_id ? issue.code_repo_id.toString() : null
            });
        }
      });

    program
      .command('fetch-repositories')
      .description('Get Aikido Repositories')
      .action(async () => {
        console.log('fetching repositories')
        const repos = await getRepositories();
        for (const repo of repos) {
          console.log(repo);
            await upsertEntity('aikido_repository', repo.id.toString(), repo.name, {
              provider: repo.provider,
              external_repo_id: repo.external_repo_id,
              active: repo.active,
              url: repo.url
            }, {});
        }
      });


    await program.parseAsync();

  } catch (error) {
    console.error('Error:', error);
  }
}

main();