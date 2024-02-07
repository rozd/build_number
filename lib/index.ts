import * as core from '@actions/core';
import {context, getOctokit} from "@actions/github";

async function run() {
  try {
    if (!process.env.GITHUB_TOKEN) {
      core.setFailed('GITHUB_TOKEN is not set');
      return;
    }

    const octokit = getOctokit(
      process.env.GITHUB_TOKEN,
    );

    const res = await octokit.rest.actions.getRepoVariable({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: 'BUILD_NUMBER',
    });

    const buildNumber = !!res.data.value
      ? parseInt(res.data.value) + 1
      : 1;

    await octokit.rest.actions.updateRepoVariable({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: 'BUILD_NUMBER',
      value: buildNumber.toString(),
    });

    core.setOutput('build_number', buildNumber.toString());
  } catch (error) {
    console.error(error);
  }
}

run();
