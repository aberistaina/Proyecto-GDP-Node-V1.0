import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Carga variables desde .env, .env.production o .env.development, etc.
  const env = loadEnv(mode, process.cwd());

  const isDev = env.VITE_APP_MODE_FRONT === "desarrollo";

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: isDev ? 5173 : 80,
      strictPort: true,
      allowedHosts: [isDev ? "localhost" : "gdp-alb-1253289742.us-east-1.elb.amazonaws.com"]
    },
    build: {
      outDir: "dist",
      emptyOutDir: true
    }
  };
});
