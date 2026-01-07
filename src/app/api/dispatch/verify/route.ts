import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const rows = Array.isArray(body?.rows) ? body.rows : []
  const verifiedBy = body?.verified_by_ops_id

  if (!verifiedBy) {
    return NextResponse.json({ error: "verified_by_ops_id is required" }, { status: 400 })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "rows are required" }, { status: 400 })
  }

  await query(
    `UPDATE dispatch_reports
     SET status = 'Confirmed',
         confirmed_by_ops_id = $2,
         confirmed_at = NOW(),
         status_updated_at = NOW()
     WHERE dispatch_id::text = ANY($1::text[])`,
    [rows, verifiedBy]
  )

  const results = rows.map((rowId: string) => ({
    dispatch_ids: [rowId],
    csv_link: null,
    seatalk_status: "pending",
  }))

  return NextResponse.json({ results })
}
