import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBuild = process.env.GITHUB_ACTIONS === "true" && repositoryName;

export default defineConfig({
  base: githubPagesBuild ? `/${repositoryName}/` : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
    },
  },
});
