import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // for sentry
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
        dimensions: false,
      },
    }),
    sentryVitePlugin({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      "@svg": "/src/assets/svg",
      "@authentication": "/src/components/authentication",
      "@chat": "/src/components/chat",
      "@notifications": "/src/components/notifications",
      "@layout": "/src/components/layout",
      "@navigation": "/src/components/navigation",
      "@profile": "/src/components/profile",
      "@shared": "/src/components/shared",
      "@contexts": "/src/contexts",
      "@helpers": "/src/helpers",
      "@hooks": "/src/hooks",
      "@pages": "/src/pages",
      "@routes": "/src/routes",
      "@styles": "/src/styles",
      "@utils": "/src/utils",
    },
  },
});
