import Header from "@/components/header"
import Footer from "@/components/footer"
import { CheckoutContent } from "@/components/checkout-content"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-12">
        <CheckoutContent />
      </main>
      <Footer />
    </div>
  )
}
