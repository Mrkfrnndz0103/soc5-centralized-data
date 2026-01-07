import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
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
