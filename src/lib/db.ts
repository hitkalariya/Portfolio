/**
 * SETUP GUIDE (3 steps)  
 * STEP 1: Set DATABASE_URL in .env.local (SQLite for dev)
 * STEP 2: Run `pnpm db:push` to create schema
 * STEP 3: Run `pnpm db:seed` to populate data
 * NOTE: Uses singleton pattern for connection pooling
 * TODO: Configure connection pooling for production
 */

import { PrismaClient } from '@prisma/client'

// BEGINNER: Set DATABASE_URL="file:./dev.db" in .env.local for SQLite
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma