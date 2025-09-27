import { defineConfig } from "@kubb/core";
import { pluginZod } from "@kubb/plugin-zod";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginOas } from "@kubb/plugin-oas";

/**
 * Kubb configuration for generating API types, Zod schemas, and React Query hooks from the OpenAPI specification.
 */

export default defineConfig({
  root: ".",
  input: {
    path: "./api-schema.yaml",
  },
  output: {
    path: "./src/services",
    clean: true,
  },
  plugins: [
    pluginOas({
      output: {
        path: "./types",
      },
    }),

    pluginTs({
      output: {
        path: "./types",
      },
    }),

    pluginZod({
      output: {
        path: "./schemas",
      },
    }),

    pluginReactQuery({
      output: {
        path: "./hooks",
      },
      client: {
        importPath: "@/services/client",
      },
    }),
  ],
  hooks: {
    done: [
      'prettier --write "src/services/**/*.{ts,tsx}"',
      'eslint --fix "src/services/**/*.{ts,tsx}"',
    ],
  },
});
