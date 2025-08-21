import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock users database
const users = [
  {
    id: "1",
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    provider: "email",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    name: "김철수",
    email: "kim@example.com",
    phone: "010-9876-5432",
    provider: "google",
    status: "active",
    createdAt: "2024-01-05T00:00:00Z",
    lastLogin: "2024-01-19T15:45:00Z",
  },
  {
    id: "3",
    name: "이영희",
    email: "lee@example.com",
    phone: "010-5555-1234",
    provider: "kakao",
    status: "suspended",
    createdAt: "2024-01-10T00:00:00Z",
    lastLogin: "2024-01-18T09:20:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
