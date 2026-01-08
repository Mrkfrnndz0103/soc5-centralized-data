import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
