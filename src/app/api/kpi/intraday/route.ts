import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  const filters: string[] = []
  const params: string[] = []

  if (date) {
    params.push(date)
    filters.push(`date = $${params.length}`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const result = await query(
    `SELECT *
     FROM kpi_intraday
     ${whereClause}
     ORDER BY timestamp DESC`,
    params
  )

  return NextResponse.json(result.rows)
}
