import Header from "@/components/header"
import Footer from "@/components/footer"
import { OrderDetail } from "@/components/order-detail"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-12">
        <OrderDetail orderId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
