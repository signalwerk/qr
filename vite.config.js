import { defineConfig } from "vite";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const base = process.env.GITHUB_ACTIONS ? `/${repo}/` : "/";

export default defineConfig({
  base,
});
