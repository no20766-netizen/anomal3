"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Ban, CheckCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  provider: string
  status: "active" | "suspended"
  createdAt: string
  lastLogin: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: "suspend" | "activate") => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">회원 관리</h1>
        <p className="text-muted-foreground">등록된 회원을 조회하고 관리합니다</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>회원 검색</CardTitle>
          <CardDescription>이름 또는 이메일로 회원을 검색할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="회원 이름 또는 이메일 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>회원 목록</CardTitle>
          <CardDescription>총 {filteredUsers.length}명의 회원</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{user.name}</h3>
                    <Badge variant={user.status === "active" ? "default" : "destructive"}>
                      {user.status === "active" ? "활성" : "정지"}
                    </Badge>
                    <Badge variant="outline">{user.provider}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>가입일: {new Date(user.createdAt).toLocaleDateString("ko-KR")}</span>
                    <span>최근 로그인: {new Date(user.lastLogin).toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    상세
                  </Button>
                  {user.status === "active" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleUserAction(user.id, "suspend")}
                    >
                      <Ban className="h-4 w-4 mr-1" />
                      정지
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 bg-transparent"
                      onClick={() => handleUserAction(user.id, "activate")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      활성화
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
