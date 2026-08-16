import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { env } from "../config.js";

// Prisma setup for this app

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});


// const databaseUrl = new URL(env.DATABASE_URL);

// console.log("DATABASE_URL", {
//   username: databaseUrl.username,
//   passwordLength: databaseUrl.password.length,
//   hostname: databaseUrl.hostname,
//   port: databaseUrl.port,
// });

// const directUrl = new URL(env.DIRECT_URL);

// console.log("DIRECT_URL", {
//   username: directUrl.username,
//   passwordLength: directUrl.password.length,
//   hostname: directUrl.hostname,
//   port: directUrl.port,
// });

export const prisma = new PrismaClient({ adapter });