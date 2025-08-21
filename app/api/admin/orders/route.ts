import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock orders database for admin
const adminOrders = [
  {
    id: "ORDER_1703123456789_abc123def",
    userId: "1",
    customerName: "홍길동",
    customerEmail: "hong@example.com",
    items: [
      {
        name: "클래식 베이스볼 캡",
        quantity: 1,
        price: 45000,
      },
    ],
    totalAmount: 45000,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
    shippingAddress: "서울시 강남구 테헤란로 123",
  },
  {
    id: "ORDER_1703123456790_def456ghi",
    userId: "2",
    customerName: "김철수",
    customerEmail: "kim@example.com",
    items: [
      {
        name: "스냅백 캡",
        quantity: 2,
        price: 38000,
      },
    ],
    totalAmount: 76000,
    status: "processing",
    createdAt: "2024-01-18T14:20:00Z",
    shippingAddress: "부산시 해운대구 센텀로 456",
  },
  {
    id: "ORDER_1703123456791_ghi789jkl",
    userId: "3",
    customerName: "이영희",
    customerEmail: "lee@example.com",
    items: [
      {
        name: "버킷햇",
        quantity: 1,
        price: 42000,
      },
    ],
    totalAmount: 42000,
    status: "pending",
    createdAt: "2024-01-20T09:15:00Z",
    shippingAddress: "대구시 중구 동성로 789",
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

    return NextResponse.json(adminOrders)
  } catch (error) {
    console.error("Admin orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
