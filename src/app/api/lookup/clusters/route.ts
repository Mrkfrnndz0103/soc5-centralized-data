import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get("region")
  const queryText = searchParams.get("query")

  const filters: string[] = ["active = true"]
  const params: string[] = []

  if (region) {
    params.push(region)
    filters.push(`region = $${params.length}`)
  }

  if (queryText) {
    params.push(`%${queryText}%`)
    filters.push(`cluster_name ILIKE $${params.length}`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const result = await query(
    `SELECT DISTINCT cluster_name, region
     FROM outbound_map
     ${whereClause}
     ORDER BY cluster_name`,
    params
  )

  return NextResponse.json(result.rows)
}
