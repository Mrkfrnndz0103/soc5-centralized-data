import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

function pickValue(row: any, keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key]
    }
  }
  return null
}

export const POST = withRequestLogging("/api/dispatch/submit", async (request: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const rows = Array.isArray(body?.rows) ? body.rows : []
  const submittedBy = body?.submitted_by_ops_id

  if (!submittedBy) {
    return NextResponse.json({ error: "submitted_by_ops_id is required" }, { status: 400 })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "rows are required" }, { status: 400 })
  }

  for (const row of rows) {
    const clusterName = pickValue(row, ["cluster_name", "clusterName"])
    const stationName = pickValue(row, ["station_name", "station"])
    const region = pickValue(row, ["region"])
    const status = pickValue(row, ["status"]) || "Pending"
    const lhTrip = pickValue(row, ["lh_trip_number", "lh_trip", "lHTripNumber"])
    const dockedTime = pickValue(row, ["actual_docked_time", "actualDockedTime"])
    const departTime = pickValue(row, ["actual_depart_time", "actualDepartTime"])
    const processor = pickValue(row, ["processor_name", "processorName"])
    const plate = pickValue(row, ["plate_number", "plateNumber"])

    await query(
      `INSERT INTO dispatch_reports
       (cluster_name, station_name, region, status, lh_trip_number, actual_docked_time, actual_depart_time, processor_name, plate_number, submitted_by_ops_id, created_at, status_updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
      [
        clusterName,
        stationName,
        region,
        status,
        lhTrip,
        dockedTime ? new Date(dockedTime) : null,
        departTime ? new Date(departTime) : null,
        processor,
        plate,
        submittedBy,
      ]
    )
  }

  return NextResponse.json({ created_count: rows.length })
})
