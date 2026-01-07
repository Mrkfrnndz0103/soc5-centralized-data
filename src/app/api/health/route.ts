import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "Outbound Internal Tool",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  })
}
