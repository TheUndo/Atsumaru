import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  envDir: "../",
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: "module",
      },

      includeAssets: [
        "logo3.svg",
        "robots.txt",
        "icon-192x192.png",
        "icon-512x512.png",
        "icon-384x384.png",
        "icon-256x256.png",
      ],
      manifest: {
        theme_color: "#726ab5",
        background_color: "#0e0e0e",
        display: "standalone",
        name: "Atsumaru - Manga Reader v1.2",
        short_name: "Atsumaru",
        description:
          "Atsumaru - The open source manga/manwha/manhua/webtoon reader for IOS, Android, Windows, Mac OS, Linux and the web",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  publicDir: "assets",
});
