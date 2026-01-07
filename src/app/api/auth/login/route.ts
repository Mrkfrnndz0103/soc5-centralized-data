import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const opsId = body?.ops_id
  const password = body?.password

  if (!opsId) {
    return NextResponse.json({ error: "ops_id is required" }, { status: 400 })
  }

  const result = await query(
    `SELECT id, ops_id, name, role, email, is_first_time, must_change_password, password_hash
     FROM users
     WHERE ops_id = $1 OR email = $1
     LIMIT 1`,
    [opsId]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const user = result.rows[0]

  if (password && user.password_hash && user.password_hash !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = randomUUID()

  return NextResponse.json({
    user: {
      ops_id: user.ops_id,
      name: user.name,
      role: user.role,
      email: user.email,
      is_first_time: user.is_first_time,
      must_change_password: user.must_change_password,
    },
    token,
  })
}
