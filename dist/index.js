"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
async function run() {
    if (!process.env.GITHUB_TOKEN) {
        core.setFailed('GITHUB_TOKEN is not set');
        return;
    }
    const octokit = (0, github_1.getOctokit)(process.env.GITHUB_TOKEN);
    let buildNumber = 1;
    try {
        const res = await octokit.rest.actions.getRepoVariable({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            name: 'BUILD_NUMBER',
        });
        if (res.status >= 200 && res.status < 300 && !!res.data.value) {
            buildNumber = parseInt(res.data.value) + 1;
        }
        await octokit.rest.actions.updateRepoVariable({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            name: 'BUILD_NUMBER',
            value: buildNumber.toString(),
        });
    }
    catch (error) {
        await octokit.rest.actions.createRepoVariable({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            name: 'BUILD_NUMBER',
            value: buildNumber.toString(),
        });
    }
    core.setOutput('build_number', buildNumber.toString());
}
run();
//# sourceMappingURL=index.js.map