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

    let buildNumber = 1;

    try {
      const res = await octokit.rest.actions.getRepoVariable({
        owner: context.repo.owner,
        repo: context.repo.repo,
        name: 'BUILD_NUMBER',
      });

      if (res.status >= 200 && res.status < 300) {
        buildNumber = res.data.value
          ? parseInt(res.data.value) + 1
          : 1;
      }
    } catch (error) {
      console.warn(error);
    }

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
