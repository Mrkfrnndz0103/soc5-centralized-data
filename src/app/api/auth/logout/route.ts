import { NextResponse } from "next/server"
import { clearSessionCookie, deleteSession, getSessionIdFromCookies } from "@/lib/auth"

export async function POST() {
  const sessionId = getSessionIdFromCookies()
  if (sessionId) {
    await deleteSession(sessionId)
  }

  const response = NextResponse.json({ success: true })
  clearSessionCookie(response)
  return response
}
