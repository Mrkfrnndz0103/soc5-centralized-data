import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(
  _request: Request,
  { params }: { params: { ops_id: string } }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await query(
    `SELECT ops_id, name, role, email, department
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
