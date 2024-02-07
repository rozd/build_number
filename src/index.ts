import * as core from '@actions/core';
import {context, getOctokit} from "@actions/github";

async function run() {
  if (!process.env.GITHUB_TOKEN) {
    core.setFailed('GITHUB_TOKEN is not set');
    return;
  }

  const octokit = getOctokit(
    process.env.GITHUB_TOKEN,
  );

  let buildNumber = 1;

  try {
    const res = await octokit.rest.actions.getRepoVariable({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: 'BUILD_NUMBER',
    });

    if (res.status >= 200 && res.status < 300  && !!res.data.value) {
      buildNumber = parseInt(res.data.value) + 1;
    }

    await octokit.rest.actions.updateRepoVariable({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: 'BUILD_NUMBER',
      value: buildNumber.toString(),
    });

  } catch (error) {
    await octokit.rest.actions.createRepoVariable({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: 'BUILD_NUMBER',
      value: buildNumber.toString(),
    });
  }

  core.setOutput('build_number', buildNumber.toString());
}



run();
