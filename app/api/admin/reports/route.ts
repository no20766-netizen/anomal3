import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

    // Mock report data based on period
    const reportData = {
      period,
      revenue: period === "week" ? 1250000 : period === "month" ? 5670000 : period === "quarter" ? 18900000 : 67800000,
      orders: period === "week" ? 28 : period === "month" ? 126 : period === "quarter" ? 421 : 1547,
      customers: period === "week" ? 24 : period === "month" ? 98 : period === "quarter" ? 312 : 1089,
      averageOrderValue: period === "week" ? 44643 : period === "month" ? 45000 : period === "quarter" ? 44893 : 43821,
      topProducts: [
        { name: "클래식 베이스볼 캡", sales: 45, revenue: 2025000 },
        { name: "스냅백 캡", sales: 38, revenue: 1444000 },
        { name: "버킷햇", sales: 32, revenue: 1344000 },
        { name: "비니", sales: 28, revenue: 1120000 },
        { name: "페도라", sales: 22, revenue: 1100000 },
      ],
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Reports fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
