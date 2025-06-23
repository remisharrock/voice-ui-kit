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
        index: path.resolve(__dirname, "src/index.ts"),

        // Separate entry for WebGL visualizers for better tree-shaking
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
        // React
        "react",
        "react-dom",
        "react/jsx-runtime",

        // Three.js (for WebGL visualizers)
        "three",
        /^three\//,

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
