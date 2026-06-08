export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Conventional commits: feat, fix, docs, chore, refactor, test, build, ci, perf, style, revert
    "scope-enum": [
      1,
      "always",
      ["core", "kb", "skills", "agents", "workflows", "docs", "ci", "repo"],
    ],
  },
};
