import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { CartProvider } from "@/contexts/cart-context"
import { SearchProvider } from "@/contexts/search-context"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"
import { Suspense } from "react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "anomal - Fashion & Accessories",
  description: "Modern fashion e-commerce for clothing and accessories",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-playfair: ${playfair.variable};
}
        `}</style>
      </head>
      <body className={`${playfair.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <SearchProvider>
              <CartProvider>{children}</CartProvider>
            </SearchProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
