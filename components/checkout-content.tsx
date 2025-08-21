"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { CreditCard, Truck, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ShippingInfo {
  name: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export function CheckoutContent() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop")
    }
  }, [items, router])

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert("배송 정보를 모두 입력해주세요.")
      return
    }

    setIsProcessing(true)

    try {
      // Create order
      const orderData = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: getTotalPrice(),
        shippingInfo,
        paymentMethod,
      }

      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("주문 생성에 실패했습니다.")
      }

      const { orderId, paymentData } = await response.json()

      // Initialize NICEPAY payment
      if (paymentMethod === "card") {
        await initializeNicePayment(orderId, paymentData)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("결제 처리 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const initializeNicePayment = async (orderId: string, paymentData: any) => {
    try {
      // Load NICEPAY script dynamically
      const script = document.createElement("script")
      script.src = "https://pay.nicepay.co.kr/v1/js/"
      script.onload = () => {
        // Initialize NICEPAY
        const nicepay = (window as any).NICEPAY
        if (nicepay) {
          nicepay.requestPay({
            clientId: process.env.NEXT_PUBLIC_NICEPAY_CLIENT_ID,
            method: "card",
            orderId: orderId,
            amount: paymentData.amount,
            goodsName: paymentData.goodsName,
            returnUrl: `${window.location.origin}/api/payment/callback`,
            fnError: (result: any) => {
              console.error("Payment error:", result)
              alert("결제에 실패했습니다: " + result.errorMsg)
            },
            fnSuccess: (result: any) => {
              // Handle successful payment
              handlePaymentSuccess(orderId, result)
            },
          })
        }
      }
      document.head.appendChild(script)
    } catch (error) {
      console.error("NICEPAY initialization error:", error)
      alert("결제 시스템 초기화에 실패했습니다.")
    }
  }

  const handlePaymentSuccess = async (orderId: string, paymentResult: any) => {
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentResult,
        }),
      })

      if (response.ok) {
        clearCart()
        router.push(`/order-success?orderId=${orderId}`)
      } else {
        throw new Error("결제 검증에 실패했습니다.")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      alert("결제 검증 중 오류가 발생했습니다.")
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">장바구니가 비어있습니다.</p>
            <Button asChild>
              <Link href="/shop">쇼핑하러 가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">주문/결제</h1>
        <p className="text-muted-foreground">주문 정보를 확인하고 결제를 진행하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Shipping & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                배송 정보
              </CardTitle>
              <CardDescription>상품을 받을 주소를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">받는 분</Label>
                  <Input
                    id="name"
                    value={shippingInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="받는 분 성함"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="휴대폰 번호"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="상세 주소"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">도시</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="도시"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">시/도</Label>
                  <Input
                    id="state"
                    value={shippingInfo.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="시/도"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">우편번호</Label>
                  <Input
                    id="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="우편번호"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 방법
              </CardTitle>
              <CardDescription>결제 수단을 선택해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    신용카드 (NICEPAY)
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  NICEPAY를 통한 안전한 결제가 보장됩니다
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
              <CardDescription>주문 내역을 확인해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm">수량: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₩{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>상품 금액</span>
                  <span>₩{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? "결제 처리 중..." : `₩${getTotalPrice().toLocaleString()} 결제하기`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                결제 버튼을 클릭하면 주문이 확정되며, 결제가 진행됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
