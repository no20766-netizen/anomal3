import Header from "@/components/header"
import Footer from "@/components/footer"
import { OrderHistory } from "@/components/order-history"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-12">
        <OrderHistory />
      </main>
      <Footer />
    </div>
  )
}
