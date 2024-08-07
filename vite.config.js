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
      "@api": "/src/api",
      "@images": "/src/assets/images",
      "@svg": "/src/assets/svg",
      "@interface": "/src/components/interface",
      "@shared": "/src/components/shared",
      "@users": "/src/components/users",
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
