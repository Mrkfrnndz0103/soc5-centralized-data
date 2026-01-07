import "server-only"
import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

const sslEnabled = process.env.DATABASE_SSL === "true"

const pool =
  globalThis.__pgPool ||
  new Pool({
    connectionString,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  })

if (!globalThis.__pgPool) {
  globalThis.__pgPool = pool
}

export async function query<T = any>(text: string, params?: any[]) {
  return pool.query<T>(text, params)
}
