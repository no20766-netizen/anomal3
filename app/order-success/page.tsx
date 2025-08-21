import Header from "@/components/header"
import Footer from "@/components/footer"
import { OrderSuccessContent } from "@/components/order-success-content"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-12">
        <OrderSuccessContent />
      </main>
      <Footer />
    </div>
  )
}
