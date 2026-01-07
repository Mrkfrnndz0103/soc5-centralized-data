import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Google login is not configured yet" }, { status: 501 })
}
