import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const sessionId = body?.session_id

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 })
  }

  await query(
    `INSERT INTO seatalk_sessions (session_id, authenticated)
     VALUES ($1, false)
     ON CONFLICT (session_id)
     DO UPDATE SET authenticated = false`,
    [sessionId]
  )

  return NextResponse.json({ success: true })
}
