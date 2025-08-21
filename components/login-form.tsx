"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, loginWithGoogle, loginWithKakao } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
    }

    setIsLoading(false)
  }

  const handleSocialLogin = async (provider: string) => {
    if (provider === "구글") {
      await loginWithGoogle()
    } else if (provider === "카카오톡") {
      await loginWithKakao()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>계정에 로그인하여 쇼핑을 시작하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialLogin("카카오톡")}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-black">K</span>
                </div>
                카카오톡으로 로그인
              </div>
            </Button>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialLogin("구글")}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-white border rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">G</span>
                </div>
                구글로 로그인
              </div>
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/signup" className="text-primary hover:underline font-medium">
              회원가입
            </Link>
          </div>

          <div className="text-center">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
