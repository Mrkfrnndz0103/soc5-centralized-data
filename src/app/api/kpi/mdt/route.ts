import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  const filters: string[] = []
  const params: string[] = []

  if (startDate) {
    params.push(startDate)
    filters.push(`date >= $${params.length}`)
  }

  if (endDate) {
    params.push(endDate)
    filters.push(`date <= $${params.length}`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const result = await query(
    `SELECT *
     FROM kpi_mdt
     ${whereClause}
     ORDER BY date DESC`,
    params
  )

  return NextResponse.json(result.rows)
}
