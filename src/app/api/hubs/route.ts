import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

export const GET = withRequestLogging("/api/hubs", async (request: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get("limit") || "10")
  const offset = Number(searchParams.get("offset") || "0")
  const activeParam = searchParams.get("active")
  const active = activeParam === null ? undefined : activeParam === "true"

  const filters: string[] = []
  const params: any[] = []

  if (active !== undefined) {
    params.push(active)
    filters.push(`active = $${params.length}`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const countResult = await query(
    `SELECT COUNT(*)::int AS total
     FROM outbound_map
     ${whereClause}`,
    params
  )

  const rowsResult = await query(
    `SELECT *
     FROM outbound_map
     ${whereClause}
     ORDER BY hub_name
     LIMIT $${params.length + 1}
     OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  )

  return NextResponse.json({ hubs: rowsResult.rows, total: countResult.rows[0]?.total || 0 })
})

export const POST = withRequestLogging("/api/hubs", async (request: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))

  const fields = Object.keys(body || {})
  if (fields.length === 0) {
    return NextResponse.json({ error: "hub data is required" }, { status: 400 })
  }

  const columns = fields.map((key) => `"${key}"`).join(", ")
  const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ")
  const values = fields.map((key) => body[key])

  const result = await query(
    `INSERT INTO outbound_map (${columns})
     VALUES (${placeholders})
     RETURNING *`,
    values
  )

  return NextResponse.json(result.rows[0])
})
