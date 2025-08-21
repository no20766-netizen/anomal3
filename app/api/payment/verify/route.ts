import { type NextRequest, NextResponse } from "next/server"

// Mock orders database
const orders: any[] = []

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { orderId, paymentResult } = await request.json()

    // Find order
    const orderIndex = orders.findIndex((order) => order.id === orderId)
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Verify payment with NICEPAY (in real implementation)
    // This would involve calling NICEPAY's verification API
    const isPaymentValid = paymentResult && paymentResult.resultCode === "0000"

    if (isPaymentValid) {
      // Update order status
      orders[orderIndex].status = "paid"
      orders[orderIndex].paymentResult = paymentResult
      orders[orderIndex].paidAt = new Date().toISOString()

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        order: orders[orderIndex],
      })
    } else {
      // Update order status to failed
      orders[orderIndex].status = "failed"
      orders[orderIndex].paymentResult = paymentResult

      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
