"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react"

interface ReportData {
  period: string
  revenue: number
  orders: number
  customers: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
}

export function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod])

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/admin/reports?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>
  }

  if (!reportData) {
    return <div className="flex items-center justify-center h-64">데이터를 불러올 수 없습니다</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">리포트</h1>
          <p className="text-muted-foreground">매출 및 운영 현황을 확인합니다</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">주간</SelectItem>
            <SelectItem value="month">월간</SelectItem>
            <SelectItem value="quarter">분기</SelectItem>
            <SelectItem value="year">연간</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{reportData.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === "week"
                ? "이번 주"
                : selectedPeriod === "month"
                  ? "이번 달"
                  : selectedPeriod === "quarter"
                    ? "이번 분기"
                    : "올해"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주문 수</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.orders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">총 주문 건수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">고객 수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.customers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">구매 고객 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 주문액</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{reportData.averageOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">건당 평균 금액</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>인기 상품</CardTitle>
            <CardDescription>판매량 기준 상위 상품</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales}개 판매</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₩{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>매출 추이</CardTitle>
            <CardDescription>기간별 매출 변화</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              차트 영역 (실제 구현 시 차트 라이브러리 사용)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
