"use client"

import type React from "react"

import { useState } from "react"
import { Search, User, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MiniCart } from "@/components/mini-cart"
import { useSearch } from "@/contexts/search-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const { setSearchQuery, setIsSearching } = useSearch()
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery.trim())
      setIsSearching(true)
      router.push("/search")
    }
  }

  const handleSearchInput = (value: string) => {
    setLocalSearchQuery(value)
    if (!value.trim()) {
      setIsSearching(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image src="/anomal-logo.png" alt="ANOMAL" width={144} height={32} className="h-8 w-auto" priority />
            </Link>
          </div>

          <div className="hidden md:flex items-center ml-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="모자 검색..."
                value={localSearchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="pl-10 bg-input border-border leading-6 w-max"
              />
            </form>
          </div>

          <div className="flex-1"></div>
          <nav className="hidden md:flex items-center space-x-8 mr-8">
            <Link href="/shop" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Right Side Actions - Cart and User buttons remain fixed */}
          <div className="flex items-center space-x-4">
            <MiniCart />

            {!isLoading &&
              (user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/mypage">마이페이지</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">주문내역</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              ))}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="모자 검색..."
                    value={localSearchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    className="pl-10 bg-input border-border"
                  />
                </form>
              </div>
              <Link href="/shop" className="block px-3 py-2 text-foreground hover:text-primary">
                Shop
              </Link>
              <Link href="/about" className="block px-3 py-2 text-foreground hover:text-primary">
                About
              </Link>
              <div className="border-t border-border pt-2 mt-2">
                {user ? (
                  <>
                    <Link href="/mypage" className="block px-3 py-2 text-foreground hover:text-primary">
                      마이페이지
                    </Link>
                    <Link href="/orders" className="block px-3 py-2 text-foreground hover:text-primary">
                      주문내역
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-foreground hover:text-primary"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block px-3 py-2 text-foreground hover:text-primary">
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
