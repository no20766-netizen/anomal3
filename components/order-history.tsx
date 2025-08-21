"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Package, Eye, Truck, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Order {
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
    address: string
    phone: string
  }
  trackingNumber?: string
}

export function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "결제 대기", variant: "secondary" as const, icon: Clock },
      processing: { label: "처리 중", variant: "default" as const, icon: Package },
      shipped: { label: "배송 중", variant: "default" as const, icon: Truck },
      delivered: { label: "배송 완료", variant: "default" as const, icon: Package },
      cancelled: { label: "취소", variant: "destructive" as const, icon: Clock },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
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
          <div className="text-muted-foreground">주문 내역을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">주문 내역</h1>
        <p className="text-muted-foreground">주문한 상품의 배송 상태를 확인하세요</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">주문 내역이 없습니다</h3>
            <p className="text-muted-foreground mb-6">아직 주문한 상품이 없습니다. 쇼핑을 시작해보세요!</p>
            <Button asChild>
              <Link href="/shop">쇼핑하러 가기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">주문 #{order.id.slice(-8)}</CardTitle>
                    <CardDescription>주문일: {new Date(order.createdAt).toLocaleDateString("ko-KR")}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
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
                          <p className="font-medium">₩{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">배송지: {order.shippingInfo.name}</p>
                      {order.trackingNumber && (
                        <p className="text-sm text-muted-foreground">운송장 번호: {order.trackingNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">총 결제 금액</p>
                      <p className="text-xl font-bold">₩{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
