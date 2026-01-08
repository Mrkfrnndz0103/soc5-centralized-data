import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

export const GET = withRequestLogging("/api/dispatch", async (request: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const region = searchParams.get("region")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const limit = Number(searchParams.get("limit") || "10")
  const offset = Number(searchParams.get("offset") || "0")

  const filters: string[] = []
  const params: any[] = []

  if (status) {
    params.push(status)
    filters.push(`status = $${params.length}`)
  }

  if (region) {
    params.push(region)
    filters.push(`region = $${params.length}`)
  }

  if (startDate) {
    params.push(startDate)
    filters.push(`created_at >= $${params.length}`)
  }

  if (endDate) {
    params.push(endDate)
    filters.push(`created_at <= $${params.length}`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const countResult = await query(
    `SELECT COUNT(*)::int AS total
     FROM dispatch_reports
     ${whereClause}`,
    params
  )

  const rowsResult = await query(
    `SELECT *
     FROM dispatch_reports
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length + 1}
     OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  )

  return NextResponse.json({
    rows: rowsResult.rows,
    total: countResult.rows[0]?.total || 0,
  })
})
