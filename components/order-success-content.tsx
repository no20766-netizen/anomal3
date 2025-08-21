"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Home } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      fetchOrderDetails(orderId)
    }
  }, [orderId])

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data)
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">주문이 완료되었습니다!</h1>
        <p className="text-muted-foreground">결제가 성공적으로 처리되었습니다.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            주문 정보
          </CardTitle>
          <CardDescription>주문 번호와 배송 정보를 확인하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">주문 번호</p>
              <p className="font-mono text-sm">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">주문 일시</p>
              <p className="text-sm">{new Date().toLocaleDateString("ko-KR")}</p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">배송 안내</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 주문 확인 후 1-2일 내 배송 시작</li>
              <li>• 배송 완료까지 2-3일 소요 예정</li>
              <li>• 배송 현황은 마이페이지에서 확인 가능</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href="/mypage">
            <Package className="mr-2 h-4 w-4" />
            주문 내역 보기
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 bg-transparent">
          <Link href="/shop">
            <Home className="mr-2 h-4 w-4" />
            쇼핑 계속하기
          </Link>
        </Button>
      </div>
    </div>
  )
}
