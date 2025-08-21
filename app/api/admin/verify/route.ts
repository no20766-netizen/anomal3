import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    return NextResponse.json({ message: "Authorized", user: decoded })
  } catch (error) {
    console.error("Admin verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
