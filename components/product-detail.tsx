"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  images: string[]
  description: string
  details: {
    material: string
    color: string
    size: string
    care: string
  }
}

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      selectedColor,
      selectedSize,
    })
    console.log("Added to cart:", product.id)
  }

  const handleBuyNow = () => {
    // Add item to cart first
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      selectedColor,
      selectedSize,
    })
    // Navigate to checkout page
    router.push("/checkout")
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              
              <span className="text-2xl font-bold text-gray-900">KRW {product.price.toLocaleString()}</span>
              
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Fit & Sizing</h4>
              <p className="text-sm text-gray-600">FREE: {product.details.size}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Fabric</h4>
              <p className="text-sm text-gray-600">{product.details.material}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Color</h4>
              <p className="text-sm text-gray-600">{product.details.color}</p>
            </div>
          </div>

          {/* Selection Options */}
          <div className="space-y-4">
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="COLOR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">블랙</SelectItem>
                <SelectItem value="white">화이트</SelectItem>
                <SelectItem value="navy">네이비</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="SIZE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">FREE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1 bg-transparent" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                장바구니 담기
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            <Button size="lg" className="w-full bg-black text-white hover:bg-gray-800" onClick={handleBuyNow}>
              바로 구매
            </Button>
          </div>

          {/* Care Instructions */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-2">관리 방법</h4>
            <p className="text-sm text-gray-600">{product.details.care}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
