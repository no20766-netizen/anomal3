import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock user database - replace with actual database
const users = [
  {
    id: "1",
    email: "test@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    name: "Test User",
    phone: "010-1234-5678",
    provider: "email",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const user = users.find((u) => u.id === decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      provider: user.provider,
      address: user.address,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userIndex = users.findIndex((u) => u.id === decoded.userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { name, phone, address } = await request.json()

    // Update user profile
    users[userIndex] = {
      ...users[userIndex],
      name,
      phone,
      address,
    }

    return NextResponse.json({
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      phone: users[userIndex].phone,
      provider: users[userIndex].provider,
      address: users[userIndex].address,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 })
  }
}
