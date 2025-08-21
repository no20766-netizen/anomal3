"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { signup, loginWithGoogle, loginWithKakao } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      setError("이용약관과 개인정보처리방침에 동의해주세요.")
      return
    }

    setIsLoading(true)

    const success = await signup(formData)

    if (success) {
      router.push("/")
    } else {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.")
    }

    setIsLoading(false)
  }

  const handleSocialSignup = async (provider: string) => {
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
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 쇼핑을 시작하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}

          <div className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialSignup("카카오톡")}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-black">K</span>
                </div>
                카카오톡으로 회원가입
              </div>
            </Button>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialSignup("구글")}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-white border rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">G</span>
                </div>
                구글로 회원가입
              </div>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는 이메일로</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">휴대폰 번호</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="휴대폰 번호를 입력하세요"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
                <Label htmlFor="terms" className="text-sm">
                  <Link href="#" className="text-primary hover:underline">
                    이용약관
                  </Link>
                  에 동의합니다
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="privacy" checked={agreedToPrivacy} onCheckedChange={setAgreedToPrivacy} />
                <Label htmlFor="privacy" className="text-sm">
                  <Link href="#" className="text-primary hover:underline">
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
