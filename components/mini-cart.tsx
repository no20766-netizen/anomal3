"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, X, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

export function MiniCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { state, removeItem, updateQuantity } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative p-2" onClick={() => setIsOpen(!isOpen)}>
        <ShoppingCart className="h-5 w-5" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {state.itemCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">장바구니</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {state.items.length === 0 ? (
                <p className="text-center text-gray-500 py-4">장바구니가 비어있습니다</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 border rounded">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.price.toLocaleString()}원</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">총 금액:</span>
                      <span className="font-bold text-lg">{state.total.toLocaleString()}원</span>
                    </div>
                    <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleCheckout}>
                      주문하기
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
