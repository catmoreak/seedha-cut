import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // process.env instead of env() so `prisma generate` works without a DB URL (e.g. during npm install)
    url: process.env.DATABASE_URL ?? "",
  },
});
