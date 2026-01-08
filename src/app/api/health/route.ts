import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { withRequestLogging } from "@/lib/request-context"

export const GET = withRequestLogging("/api/health", async (_request: Request) => {
  try {
    await query("SELECT 1")
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error instanceof Error ? error.message : "Database check failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "Outbound Internal Tool",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  })
})
