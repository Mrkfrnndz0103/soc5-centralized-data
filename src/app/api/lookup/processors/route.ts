import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

export const GET = withRequestLogging("/api/lookup/processors", async (request: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
})
