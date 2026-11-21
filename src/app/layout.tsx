import type { Metadata } from "next";
import { Header } from "@/components/header";
import { AnalysisProvider } from "@/contexts/analysis-context";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "안심링크", template: "%s | 안심링크" },
  description: "URL, 문자, QR 코드의 스미싱 위험 요소를 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <AnalysisProvider>
            <Header />
            {children}
            <footer className="border-t border-slate-200 bg-white">
              <div className="page-container flex flex-col gap-2 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <p>분석 결과는 참고 정보이며 대상의 안전을 보장하지 않습니다.</p>
                <p>검사 원문과 이미지는 DB에 저장하지 않습니다.</p>
              </div>
            </footer>
          </AnalysisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
