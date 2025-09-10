import { defineConfig } from "convex/server";
import r2 from "@convex-dev/r2/convex.config";

export default defineConfig({
  functions: "./convex",
  use: [
    r2({
      // R2 component configuration
      // Environment variables will be used for actual credentials
    }),
  ],
});