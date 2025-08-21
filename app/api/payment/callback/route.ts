import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Handle NICEPAY callback
    const formData = await request.formData()
    const resultCode = formData.get("ResultCode")
    const orderId = formData.get("Moid")
    const amount = formData.get("Amt")

    // Log the callback for debugging
    console.log("NICEPAY Callback:", {
      resultCode,
      orderId,
      amount,
    })

    // In a real implementation, you would:
    // 1. Verify the payment with NICEPAY's server
    // 2. Update the order status in your database
    // 3. Send confirmation emails, etc.

    if (resultCode === "3001") {
      // Payment successful
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/order-success?orderId=${orderId}`)
    } else {
      // Payment failed
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/order-failed?orderId=${orderId}`)
    }
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/order-failed`)
  }
}
