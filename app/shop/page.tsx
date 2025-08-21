import Header from "@/components/header"
import Footer from "@/components/footer"
import { ShopContent } from "@/components/shop-content"

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ShopContent />
      </main>
      <Footer />
    </div>
  )
}
