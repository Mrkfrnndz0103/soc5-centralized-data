import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const opsId = body?.ops_id
  const oldPassword = body?.old_password
  const newPassword = body?.new_password

  if (!opsId || !oldPassword || !newPassword) {
    return NextResponse.json({ error: "ops_id, old_password, and new_password are required" }, { status: 400 })
  }

  const result = await query(
    `SELECT password_hash
     FROM users
     WHERE ops_id = $1
     LIMIT 1`,
    [opsId]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const storedHash = result.rows[0].password_hash
  if (storedHash && storedHash !== oldPassword) {
    return NextResponse.json({ error: "Incorrect old password" }, { status: 401 })
  }

  await query(
    `UPDATE users
     SET password_hash = $2
     WHERE ops_id = $1`,
    [opsId, newPassword]
  )

  return NextResponse.json({ message: "Password updated successfully" })
}
