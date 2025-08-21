import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock orders database
const orders = [
  {
    id: "ORDER_1703123456789_abc123def",
    userId: "1",
    items: [
      {
        id: "1",
        name: "클래식 베이스볼 캡",
        price: 45000,
        quantity: 1,
        image: "/baseball-cap-display.png",
        color: "블랙",
        size: "FREE",
      },
    ],
    totalAmount: 45000,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
    shippingInfo: {
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123",
      city: "서울",
      state: "서울특별시",
      zipCode: "06234",
    },
    paymentMethod: "card",
    trackingNumber: "1234567890123",
    statusHistory: [
      {
        status: "pending",
        timestamp: "2024-01-15T10:30:00Z",
        description: "주문이 접수되었습니다",
      },
      {
        status: "processing",
        timestamp: "2024-01-15T14:20:00Z",
        description: "상품 준비 중입니다",
      },
      {
        status: "shipped",
        timestamp: "2024-01-16T09:15:00Z",
        description: "상품이 발송되었습니다",
      },
      {
        status: "delivered",
        timestamp: "2024-01-17T16:45:00Z",
        description: "배송이 완료되었습니다",
      },
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userOrders = orders.filter((order) => order.userId === decoded.userId)

    return NextResponse.json(userOrders)
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
