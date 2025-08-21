"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useSearch } from "@/contexts/search-context"

const products = [
  {
    id: 1,
    name: "클래식 베이스볼 캡",
    price: "29,000원",
    image: "/baseball-cap-display.png",
    likes: 2901,
    badge: null,
    keywords: ["베이스볼", "캡", "클래식", "모자"],
  },
  {
    id: 2,
    name: "프리미엄 스냅백",
    price: "45,000원",
    image: "/baseball-cap-display.png",
    likes: 1901,
    badge: "HOT",
    keywords: ["스냅백", "프리미엄", "모자"],
  },
  {
    id: 3,
    name: "코튼 버킷햇",
    price: "35,000원",
    image: "/baseball-cap-display.png",
    likes: 687,
    badge: "NEW",
    keywords: ["버킷햇", "코튼", "모자"],
  },
  {
    id: 4,
    name: "울 비니",
    price: "25,000원",
    image: "/baseball-cap-display.png",
    likes: 1205,
    badge: null,
    keywords: ["비니", "울", "모자"],
  },
  {
    id: 5,
    name: "트러커 캡",
    price: "32,000원",
    image: "/baseball-cap-display.png",
    likes: 856,
    badge: null,
    keywords: ["트러커", "캡", "모자"],
  },
  {
    id: 6,
    name: "페도라 햇",
    price: "48,000원",
    image: "/baseball-cap-display.png",
    likes: 1432,
    badge: "NEW",
    keywords: ["페도라", "햇", "모자"],
  },
]

export function SearchResults() {
  const { searchQuery, isSearching } = useSearch()
  const [likedProducts, setLikedProducts] = useState<number[]>([])

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  if (!isSearching || !searchQuery.trim()) {
    return null
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">검색 결과: "{searchQuery}"</h2>
        <p className="text-gray-600">{filteredProducts.length}개의 상품을 찾았습니다</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
          <p className="text-gray-400 mt-2">다른 검색어를 시도해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <div className="w-full h-full bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {product.badge && (
                      <Badge
                        className={`absolute top-2 left-2 ${
                          product.badge === "HOT" ? "bg-red-500" : "bg-blue-500"
                        } text-white`}
                      >
                        {product.badge}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        toggleLike(product.id)
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <p className="font-bold text-lg">{product.price}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
