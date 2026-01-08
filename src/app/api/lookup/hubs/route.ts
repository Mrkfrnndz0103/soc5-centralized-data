import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

export const GET = withRequestLogging("/api/lookup/hubs", async (request: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const cluster = searchParams.get("cluster")

  const filters: string[] = ["active = true"]
  const params: string[] = []

  if (cluster) {
    params.push(cluster)
    filters.push(`cluster_name = $${params.length}`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const result = await query(
    `SELECT hub_name, dock_number
     FROM outbound_map
     ${whereClause}
     ORDER BY hub_name`,
    params
  )

  return NextResponse.json(result.rows)
})
