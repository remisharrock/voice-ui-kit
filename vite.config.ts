import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import postcss from "postcss";
import prefixer from "postcss-prefix-selector";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

function dualCssPlugin() {
  return {
    name: "dual-css",
    closeBundle() {
      const cssPath = path.resolve(__dirname, "dist/voice-ui-kit.css");

      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, "utf-8");

        postcss([
          prefixer({
            prefix: ".vkui-root",
          }),
        ])
          .process(cssContent, { from: undefined })
          .then((result) => {
            const scopedCssPath = path.resolve(
              __dirname,
              "dist/voice-ui-kit-scoped.css",
            );
            fs.writeFileSync(scopedCssPath, result.css);
          });
      }
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    dts({
      insertTypesEntry: true,
      exclude: ["**/*.stories.*", "**/*.test.*"],
      outDir: "dist",
      rollupTypes: true,
    }),
    dualCssPlugin(),
  ],

  css: {
    postcss: {
      plugins: [],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        metrics: path.resolve(__dirname, "src/components/metrics/index.ts"),
        webgl: path.resolve(__dirname, "src/visualizers/webgl/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "mjs" : "cjs"}`,
    },

    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@daily-co/daily-js",
        "@pipecat-ai/client-js",
        "@pipecat-ai/client-react",
        "@pipecat-ai/daily-transport",
        "@pipecat-ai/small-webrtc-transport",
      ],

      output: {
        globals: {
          "@daily-co/daily-js": "Daily",
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },

    minify: false,
    sourcemap: true,
  },
});
