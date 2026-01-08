import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { withRequestLogging } from "@/lib/request-context"

export const PATCH = withRequestLogging(
  "/api/hubs/[id]",
  async (request: Request, { params }: { params: { id: string } }) => {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const fields = Object.keys(body || {})

    if (fields.length === 0) {
      return NextResponse.json({ error: "hub data is required" }, { status: 400 })
    }

    const assignments = fields.map((key, index) => `"${key}" = $${index + 1}`).join(", ")
    const values = fields.map((key) => body[key])
    values.push(params.id)

    const result = await query(
      `UPDATE outbound_map
       SET ${assignments}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Hub not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  }
)

export const DELETE = withRequestLogging(
  "/api/hubs/[id]",
  async (_request: Request, { params }: { params: { id: string } }) => {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query(
      `UPDATE outbound_map
       SET active = false
       WHERE id = $1
       RETURNING *`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Hub not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  }
)
