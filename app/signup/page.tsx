import Header from "@/components/header"
import Footer from "@/components/footer"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-12">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}
