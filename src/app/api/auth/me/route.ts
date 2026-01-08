import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

export const GET = withRequestLogging("/api/auth/me", async (_request: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ user: session.user })
})
