"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { User, MapPin, Package, Settings } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

export function MyPageContent() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement actual profile update API call
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        setIsEditing(false)
        alert("프로필이 성공적으로 업데이트되었습니다.")
      } else {
        alert("프로필 업데이트에 실패했습니다.")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      alert("프로필 업데이트 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }))
    } else {
      setProfile((prev) => ({ ...prev, [field]: value }))
    }
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
        <p className="text-muted-foreground">계정 정보를 관리하고 주문 내역을 확인하세요</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            주소
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            주문내역
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>개인 정보를 확인하고 수정할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" value={profile.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">휴대폰 번호</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>가입 방법</Label>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-muted rounded text-sm">
                        {user.provider === "email" ? "이메일" : user.provider === "google" ? "구글" : "카카오톡"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      정보 수정
                    </Button>
                  ) : (
                    <>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "저장 중..." : "저장"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        취소
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>배송 주소</CardTitle>
              <CardDescription>주문 시 사용될 기본 배송 주소를 설정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">주소</Label>
                  <Input
                    id="street"
                    placeholder="상세 주소를 입력하세요"
                    value={profile.address.street}
                    onChange={(e) => handleInputChange("address.street", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">도시</Label>
                    <Input
                      id="city"
                      placeholder="도시"
                      value={profile.address.city}
                      onChange={(e) => handleInputChange("address.city", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">시/도</Label>
                    <Input
                      id="state"
                      placeholder="시/도"
                      value={profile.address.state}
                      onChange={(e) => handleInputChange("address.state", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">우편번호</Label>
                    <Input
                      id="zipCode"
                      placeholder="우편번호"
                      value={profile.address.zipCode}
                      onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      주소 수정
                    </Button>
                  ) : (
                    <>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "저장 중..." : "저장"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        취소
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>주문 내역</CardTitle>
              <CardDescription>최근 주문 내역을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">아직 주문 내역이 없습니다</p>
                <Button asChild>
                  <Link href="/shop">쇼핑하러 가기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>계정 설정</CardTitle>
              <CardDescription>계정 관련 설정을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">비밀번호 변경</h3>
                <p className="text-sm text-muted-foreground mb-4">보안을 위해 정기적으로 비밀번호를 변경하세요</p>
                <Button variant="outline">비밀번호 변경</Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">알림 설정</h3>
                <p className="text-sm text-muted-foreground mb-4">주문 상태 및 프로모션 알림을 관리합니다</p>
                <Button variant="outline">알림 설정</Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2 text-red-600">계정 삭제</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다
                </p>
                <Button variant="destructive">계정 삭제</Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">로그아웃</h3>
                <p className="text-sm text-muted-foreground mb-4">현재 세션에서 로그아웃합니다</p>
                <Button variant="outline" onClick={logout}>
                  로그아웃
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
