import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

loadEnvFile(".env");

export default defineConfig({
  schema: "prisma/schema.prisma"
});
