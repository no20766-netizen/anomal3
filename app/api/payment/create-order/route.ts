import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock orders database
const orders: any[] = []

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const { items, totalAmount, shippingInfo, paymentMethod } = await request.json()

    // Generate order ID
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create order
    const order = {
      id: orderId,
      userId: decoded.userId,
      items,
      totalAmount,
      shippingInfo,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(order)

    // Prepare payment data for NICEPAY
    const paymentData = {
      amount: totalAmount,
      goodsName: items.length > 1 ? `${items[0].name} 외 ${items.length - 1}건` : items[0].name,
      buyerName: shippingInfo.name,
      buyerTel: shippingInfo.phone,
      buyerEmail: decoded.email || "",
    }

    return NextResponse.json({
      orderId,
      paymentData,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 })
  }
}
