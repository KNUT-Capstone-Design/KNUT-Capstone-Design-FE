"use client";
import Link from "next/link";
import { useAnalysis } from "@/contexts/analysis-context";

const styles = {
  safe: { label: "안전", color: "text-green-800", bg: "bg-green-50 border-green-200", bar: "bg-green-600" },
  caution: { label: "주의", color: "text-amber-800", bg: "bg-amber-50 border-amber-200", bar: "bg-amber-600" },
  danger: { label: "위험", color: "text-red-800", bg: "bg-red-50 border-red-200", bar: "bg-red-700" },
};

export default function ResultPage() {
  const { result } = useAnalysis();
  if (!result) return <main className="page-container grid min-h-[60vh] place-items-center py-16"><section className="max-w-lg rounded-lg border border-slate-200 bg-white p-8 text-center "><h1 className="text-2xl font-bold">표시할 검사 결과가 없습니다.</h1><p className="mt-3 text-slate-600">검사 유형을 선택하고 의심 자료를 먼저 분석해 주세요.</p><Link href="/analyze/url" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-5 font-bold text-white">URL 검사로 이동</Link></section></main>;
  const { data } = result;
  const tone = styles[data.risk.level];
  return <main className="page-container py-12 sm:py-16"><div className="mx-auto max-w-4xl">
    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">검사 결과</h1>
    {data.warnings.map((warning) => <div key={warning.code} className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">⚠ {warning.message}</div>)}
    <section className={`mt-8 rounded-lg border p-6 sm:p-8 ${tone.bg}`}>
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-bold text-slate-600">종합 위험 등급</p><h2 className={`mt-2 text-4xl font-bold ${tone.color}`}>{tone.label}</h2></div><p className={`text-5xl font-bold ${tone.color}`}>{data.risk.score}<span className="text-xl"> / 100</span></p></div>
      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/80"><div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${data.risk.score}%` }} /></div>
      <p className="mt-6 leading-7 text-slate-800">{data.risk.summary}</p>
      {data.risk.overridden && <p className="mt-4 font-bold text-red-800">치명적인 위험 신호가 확인되어 위험 등급으로 상향되었습니다.</p>}
    </section>
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">판단 근거</h2>{data.risk.findings.length ? <ul className="mt-4 space-y-3">{data.risk.findings.map((item) => <li key={item.rule_id} className="rounded-xl bg-slate-50 p-4"><span className="text-xs font-bold text-slate-500">{{ info: "안내", warning: "주의", critical: "심각" }[item.severity]}</span><p className="mt-1">{item.description}</p></li>)}</ul> : <p className="mt-4 leading-7 text-slate-600">현재 검사 범위에서 표시할 위험 신호가 없습니다. 이는 절대적인 안전을 보장하지 않습니다.</p>}</section>
      <section className="rounded-lg border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">권장 행동</h2><ol className="mt-4 space-y-3">{data.risk.recommendations.map((item, index) => <li key={item.code} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">{index + 1}</span><span className="leading-7">{item.message}</span></li>)}</ol></section>
    </div>
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6"><h2 className="font-bold">검사한 주소 정보</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">호스트</dt><dd className="mt-1 break-all font-medium">{data.details.hostname}</dd></div><div><dt className="text-slate-500">검사 시각</dt><dd className="mt-1 font-medium">{new Date(data.analyzed_at).toLocaleString("ko-KR")}</dd></div></dl><p className="mt-4 break-all rounded-lg bg-slate-100 p-3 font-mono text-sm">{data.details.normalized_url}</p></section>
    <div className="mt-8 flex flex-wrap gap-3"><Link href="/analyze/url" className="min-h-11 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">다시 검사하기</Link><Link href="/education" className="min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold">관련 사례 보기</Link><Link href="/quiz" className="min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold">예방 퀴즈</Link></div>
    <p className="mt-8 text-sm leading-6 text-slate-500">이 결과는 주소 문자열을 기반으로 한 참고 정보이며 수사기관 또는 보안 전문기관의 확정 판정이 아닙니다.</p>
  </div></main>;
}
