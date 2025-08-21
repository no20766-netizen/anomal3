import Header from "@/components/header"
import HeroSlider from "@/components/hero-slider"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlider />
      </main>
      <Footer />
    </div>
  )
}
