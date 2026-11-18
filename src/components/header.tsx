"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  ["/analyze/url", "URL 검사"], ["/analyze/message", "문자 검사"],
  ["/analyze/qr", "QR 검사"], ["/education", "교육"], ["/quiz", "퀴즈"],
] as const;

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="relative z-50 border-b border-slate-200 bg-white">
      <div className="page-container flex min-h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <svg aria-hidden="true" viewBox="0 0 28 28" className="size-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2 24 6v8c0 6-10 12-10 12S4 20 4 14V6z" /><path d="m9 14 3 3 7-7" /></svg>
          <span>안심링크</span>
        </Link>
        <button type="button" className="min-h-11 rounded-md border border-slate-300 px-4 font-semibold md:hidden" aria-expanded={isOpen} aria-controls="main-navigation" onClick={() => setIsOpen((open) => !open)}>메뉴</button>
        <nav id="main-navigation" aria-label="주요 메뉴" className={`${isOpen ? "flex" : "hidden"} absolute inset-x-0 top-20 flex-col border-b border-slate-200 bg-white p-5 shadow-sm md:static md:flex md:flex-row md:border-0 md:p-0 md:shadow-none`}>
          {navItems.map(([href, label]) => {
            const current = pathname === href;
            return <Link key={href} href={href} onClick={() => setIsOpen(false)} aria-current={current ? "page" : undefined} className={`px-4 py-3 text-sm font-semibold ${current ? "text-blue-700 underline underline-offset-8" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>{label}</Link>;
          })}
          <Link href="/login" onClick={() => setIsOpen(false)} aria-current={pathname === "/login" ? "page" : undefined} className="mx-2 mt-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 md:mt-0">로그인</Link>
        </nav>
      </div>
    </header>
  );
}
