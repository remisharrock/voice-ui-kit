import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: ["**/*.stories.*", "**/*.test.*"],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    lib: {
      entry: {
        // Main entry - core components
        index: path.resolve(__dirname, "src/index.ts"),

        // WebGL visualizers - three.js NOT bundled
        "visualizers/webgl": path.resolve(
          __dirname,
          "src/vizualizers/webgl/index.ts",
        ),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const ext = format === "es" ? "es.js" : "cjs.js";
        return `${entryName}.${ext}`;
      },
    },

    rollupOptions: {
      external: [
        // React - always external
        "react",
        "react-dom",
        "react/jsx-runtime",

        // Three.js - always external (peer dependency)
        "three",
        /^three\//, // Also externalize three.js submodules

        // Chart.js - external (peer dependency for metrics)
        "chart.js",
        "react-chartjs-2",

        // Transport libraries - external (peer dependencies)
        "@daily-co/daily-js",
        "@pipecat-ai/daily-transport",
        "@pipecat-ai/small-webrtc-transport",
      ],

      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          three: "THREE",
        },
      },
    },

    minify: false,
    sourcemap: true,
  },
});
