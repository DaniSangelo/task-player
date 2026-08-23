import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is require to connect to the database');

declare global {
  var cachedPrisma: ReturnType<typeof createPrismaClient>;
}

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter });
}

let prisma: ReturnType<typeof createPrismaClient>;
if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = createPrismaClient()
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;