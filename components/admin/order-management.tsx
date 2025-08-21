"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Package, Truck, CheckCircle } from "lucide-react"

interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: string
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders() // Refresh the list
      }
    } catch (error) {
      console.error("Failed to update order status:", error)
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

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">주문 관리</h1>
        <p className="text-muted-foreground">주문 내역을 확인하고 상태를 관리합니다</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주문 필터</CardTitle>
          <CardDescription>주문 상태별로 필터링할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">결제 대기</SelectItem>
              <SelectItem value="processing">처리 중</SelectItem>
              <SelectItem value="shipped">배송 중</SelectItem>
              <SelectItem value="delivered">배송 완료</SelectItem>
              <SelectItem value="cancelled">취소</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
          <CardDescription>총 {filteredOrders.length}개의 주문</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">주문 #{order.id.slice(-8)}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">고객: {order.customerName}</p>
                    <p className="text-sm text-muted-foreground">이메일: {order.customerEmail}</p>
                    <p className="text-sm text-muted-foreground">
                      주문일: {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₩{order.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{order.items.length}개 상품</p>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-2">주문 상품</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      상세보기
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <Button size="sm" onClick={() => handleStatusChange(order.id, "processing")}>
                        <Package className="h-4 w-4 mr-1" />
                        처리 시작
                      </Button>
                    )}
                    {order.status === "processing" && (
                      <Button size="sm" onClick={() => handleStatusChange(order.id, "shipped")}>
                        <Truck className="h-4 w-4 mr-1" />
                        배송 시작
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button size="sm" onClick={() => handleStatusChange(order.id, "delivered")}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        배송 완료
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
