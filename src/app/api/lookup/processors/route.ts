import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryText = searchParams.get("query")

  const filters: string[] = ["role = 'Processor'"]
  const params: string[] = []

  if (queryText) {
    params.push(`%${queryText}%`)
    filters.push(`name ILIKE $${params.length}`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const result = await query(
    `SELECT name, ops_id
     FROM users
     ${whereClause}
     ORDER BY name
     LIMIT 10`,
    params
  )

  return NextResponse.json(result.rows)
}
