import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Google OAuth configuration
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`

  if (!googleClientId) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 })
  }

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleClientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline`

  return NextResponse.redirect(googleAuthUrl)
}
