import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import '@dotenvx/dotenvx/config'

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  
export const prisma = new PrismaClient({ adapter });