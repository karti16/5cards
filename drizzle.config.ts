require("dotenv").config();

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.VITE_DATABASE_URL!,
    authToken: process.env.VITE_DATABASE_AUTH_TOKEN,
  },
} satisfies Config;