import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductDetail from "@/components/product-detail"

// Mock product data - in real app this would come from database
const products = [
  {
    id: "1",
    name: "클래식 베이스볼 캡",
    price: 45000,
    originalPrice: 50000,
    images: ["/baseball-cap-display.png"],
    description: "클래식한 디자인의 베이스볼 캡으로 어떤 스타일에도 잘 어울립니다.",
    details: {
      material: "100% 코튼",
      color: "블랙",
      size: "FREE (머리둘레 56-60cm)",
      care: "손세탁 권장",
    },
  },
  {
    id: "2",
    name: "빈티지 버킷햇",
    price: 38000,
    originalPrice: 42000,
    images: ["/colorful-backpack-on-wooden-table.png"],
    description: "빈티지 감성의 버킷햇으로 캐주얼한 룩을 완성해보세요.",
    details: {
      material: "코튼 100%",
      color: "베이지",
      size: "FREE (머리둘레 57-61cm)",
      care: "찬물 손세탁",
    },
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}
