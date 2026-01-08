import { NextResponse } from "next/server"
import { clearSessionCookie, deleteSession, getSessionIdFromCookies } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

export const POST = withRequestLogging("/api/auth/logout", async (_request: Request) => {
  const sessionId = getSessionIdFromCookies()
  if (sessionId) {
    await deleteSession(sessionId)
  }

  const response = NextResponse.json({ success: true })
  clearSessionCookie(response)
  return response
})
