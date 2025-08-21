import Header from "@/components/header"
import Footer from "@/components/footer"
import { SearchResults } from "@/components/search-results"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <SearchResults />
      </main>
      <Footer />
    </div>
  )
}
