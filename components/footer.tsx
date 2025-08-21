import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-0">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">ANOMAL</h3>
            <p className="text-sm text-muted-foreground">프리미엄 의류 및 악세사리를 제공하는 온라인 쇼핑몰입니다.</p>
          </div>

          {/* Quick Links */}
          

          {/* Customer Service */}
          

          {/* Business Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Business Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>주소: 서울특별시 강남구 테헤란로 123</p>
              <p>사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 제2024-서울강남-1234호</p>
              <p>대표자: 주영도  </p>
              <p>contact: 010 2836 8527     </p>
              <p>{"email : anomal25@naver.com"}  </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2024 ANOMAL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
