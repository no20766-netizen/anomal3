import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Mock admin credentials
const adminCredentials = {
  username: "admin",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (username !== adminCredentials.username) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, adminCredentials.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create admin JWT token
    const token = jwt.sign({ userId: "admin", role: "admin" }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "8h",
    })

    const response = NextResponse.json({ message: "Login successful" })
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
