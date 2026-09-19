import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "apk-mime-type",
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith("/clutchblox.apk") || req.url.endsWith(".apk"))) {
            const apkPath = path.resolve(__dirname, "dist/clutchblox.apk");
            if (fs.existsSync(apkPath)) {
              const stat = fs.statSync(apkPath);
              res.writeHead(200, {
                "Content-Type": "application/vnd.android.package-archive",
                "Content-Length": stat.size,
                "Content-Disposition": 'attachment; filename="ClutchBlox.apk"',
              });
              fs.createReadStream(apkPath).pipe(res);
              return;
            }
          }
          next();
        });
      },
    },
  ],
  preview: {
    port: 4173,
    host: "0.0.0.0",
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: "127.0.0.1",
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    target: process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
