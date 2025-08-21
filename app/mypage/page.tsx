import Header from "@/components/header"
import Footer from "@/components/footer"
import { MyPageContent } from "@/components/mypage-content"

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-12">
        <MyPageContent />
      </main>
      <Footer />
    </div>
  )
}
