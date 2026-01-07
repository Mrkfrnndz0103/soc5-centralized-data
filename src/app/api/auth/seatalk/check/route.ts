import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 })
  }

  const result = await query(
    `SELECT email, authenticated
     FROM seatalk_sessions
     WHERE session_id = $1 AND authenticated = true
     LIMIT 1`,
    [sessionId]
  )

  if (result.rows.length === 0) {
    return NextResponse.json(null)
  }

  return NextResponse.json({
    email: result.rows[0].email,
    authenticated: result.rows[0].authenticated,
  })
}
