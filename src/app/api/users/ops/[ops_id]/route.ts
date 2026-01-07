import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: { ops_id: string } }
) {
  const result = await query(
    `SELECT id, ops_id, name, role, email, is_first_time, must_change_password, department
     FROM users
     WHERE ops_id = $1
     LIMIT 1`,
    [params.ops_id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}
