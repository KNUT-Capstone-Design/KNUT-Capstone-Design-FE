import Link from "next/link";
export function PlannedPage({ title, description }: { title: string; description: string }) {
  return <main className="page-container grid min-h-[65vh] place-items-center py-16"><section className="max-w-xl py-8 text-left"><span className="text-sm text-slate-500">준비 중</span><h1 className="mt-5 text-3xl font-bold">{title}</h1><p className="mt-4 leading-7 text-slate-600">{description}</p><p className="mt-3 text-sm text-slate-500">아직 이용할 수 없는 기능입니다. 현재는 URL 검사 화면을 이용할 수 있습니다.</p><Link href="/analyze/url" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-5 font-bold text-white">먼저 URL 검사하기</Link></section></main>;
}
