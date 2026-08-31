import { definePrismaConfig } from "prisma/config";
import { env } from "./config.js";

// Actual database connection setup with remote database

export default definePrismaConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js", // node runs this command not prisma
  },
  datasource: {
    url: env.DIRECT_URL
  },
});
