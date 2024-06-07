import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
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
  ],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@chat": "/src/components/chat",
      "@login": "/src/components/login",
      "@shared": "/src/components/shared",
      "@user": "/src/components/user",
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
