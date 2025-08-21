import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
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
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      name,
      phone,
      provider: "email" as const,
    }

    users.push(newUser)

    // Create JWT token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "7d",
    })

    // Set cookie
    const response = NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      provider: newUser.provider,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
