"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Package, Truck, MapPin, Phone, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface OrderDetailProps {
  orderId: string
}

interface OrderDetail {
  id: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
    color?: string
    size?: string
  }>
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingInfo: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: string
  trackingNumber?: string
  statusHistory: Array<{
    status: string
    timestamp: string
    description: string
  }>
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetail()
    }
  }, [user, orderId])

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else if (response.status === 404) {
        router.push("/orders")
      }
    } catch (error) {
      console.error("Failed to fetch order detail:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "결제 대기", variant: "secondary" as const },
      processing: { label: "처리 중", variant: "default" as const },
      shipped: { label: "배송 중", variant: "default" as const },
      delivered: { label: "배송 완료", variant: "default" as const },
      cancelled: { label: "취소", variant: "destructive" as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">로그인이 필요한 페이지입니다.</p>
            <Button asChild>
              <Link href="/login">로그인하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">주문 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">주문을 찾을 수 없습니다.</p>
            <Button asChild>
              <Link href="/orders">주문 내역으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            주문 내역으로 돌아가기
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">주문 상세</h1>
            <p className="text-muted-foreground">주문 #{order.id.slice(-8)}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                주문 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{item.name}</h4>
                      {(item.color || item.size) && (
                        <p className="text-sm text-muted-foreground">
                          {item.color && `색상: ${item.color}`}
                          {item.color && item.size && " / "}
                          {item.size && `사이즈: ${item.size}`}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">수량: {item.quantity}개</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₩{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">개당 ₩{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                배송 추적
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory?.map((status, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium">{status.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(status.timestamp).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">배송 정보가 업데이트되면 여기에 표시됩니다.</p>}
              </div>
              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">운송장 번호</p>
                  <p className="text-lg font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>₩{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span>₩{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>결제 방법: {order.paymentMethod === "card" ? "신용카드" : order.paymentMethod}</p>
                <p>주문일: {new Date(order.createdAt).toLocaleDateString("ko-KR")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.shippingInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.shippingInfo.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{order.shippingInfo.address}</p>
                  <p>
                    {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
