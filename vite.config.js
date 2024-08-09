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
      "@images": "/src/assets/images",
      "@svg": "/src/assets/svg",
      "@authentication": "/src/components/authentication",
      "@chat": "/src/components/chat",
      "@invites": "/src/components/invites",
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
