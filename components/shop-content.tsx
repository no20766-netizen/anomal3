"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = ["전체", "모자"]

const productCategories = [
  { name: "인기 모자", image: "/baseball-cap-display.png" },
  { name: "베이스볼 캡", image: "/baseball-cap-display.png" },
  { name: "비니", image: "/baseball-cap-display.png" },
  { name: "버킷햇", image: "/baseball-cap-display.png" },
  { name: "스냅백", image: "/baseball-cap-display.png" },
  { name: "트러커 캡", image: "/baseball-cap-display.png" },
]

const filterOptions = [
  { label: "빠른배송", color: "bg-green-500" },
  { label: "브랜드배송", color: "bg-purple-500" },
  { label: "해외배송", color: "bg-blue-500" },
  { label: "프리미엄배송", color: "bg-orange-500" },
]

const products = [
  {
    id: 1,
    name: "클래식 베이스볼 캡",
    price: "29,000원",
    image: "/baseball-cap-display.png",
    likes: 2901,
    badge: null,
  },
  {
    id: 2,
    name: "프리미엄 스냅백",
    price: "45,000원",
    image: "/baseball-cap-display.png",
    likes: 1901,
    badge: "HOT",
  },
  {
    id: 3,
    name: "코튼 버킷햇",
    price: "35,000원",
    image: "/baseball-cap-display.png",
    likes: 687,
    badge: "NEW",
  },
  {
    id: 4,
    name: "울 비니",
    price: "25,000원",
    image: "/baseball-cap-display.png",
    likes: 1205,
    badge: null,
  },
]

export function ShopContent() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [likedProducts, setLikedProducts] = useState<number[]>([])

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">{"shop"}</h1>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Categories Grid */}
      <div className="mb-8"></div>

      {/* Filter Options */}
      <div className="mb-6"></div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/shop/${product.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow mx-0 px-2.5 py-2.5 border-0 opacity-100">
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
    </div>
  )
}
