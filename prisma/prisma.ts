import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from "../app/generated/prisma/client";

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

const adapter = new PrismaLibSql({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

const prisma =  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma