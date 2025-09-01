import config from "@10xscale/eslint-modern"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default [
  ...config,
  {
    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@", path.resolve(__dirname, "./src")],
            ["@hooks", path.resolve(__dirname, "./src/hooks")],
            ["@lib", path.resolve(__dirname, "./src/lib")],
            ["@context", path.resolve(__dirname, "./src/lib/context")],
            ["@pages", path.resolve(__dirname, "./src/pages")],
            ["@constants", path.resolve(__dirname, "./src/lib/constants")],
            ["@api", path.resolve(__dirname, "./src/services/api")],
            ["@query", path.resolve(__dirname, "./src/services/query")],
            ["@store", path.resolve(__dirname, "./src/services/store")],
            ["@public", path.resolve(__dirname, "./public")],
          ],
          extensions: [".js", ".jsx"],
        },
        node: {
          extensions: [".js", ".jsx"],
        },
      },
    },
  },
  {
    languageOptions: {
      globals: {
        console: "readonly",
        window: "readonly",
        localStorage: "readonly",
      },
    },
  },
]
