"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisApiError, analyzeUrl } from "@/lib/analysis";
import { useAnalysis } from "@/contexts/analysis-context";

function validateUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "검사할 URL을 입력하세요.";
  if (Array.from(trimmed).length > 2048) return "URL은 최대 2,048자까지 입력할 수 있습니다.";
  try {
    const url = new URL(trimmed);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) throw new Error();
    return null;
  } catch { return "http:// 또는 https://로 시작하는 올바른 URL을 입력하세요."; }
}

export default function UrlAnalysisPage() {
  const router = useRouter();
  const { setResult } = useAnalysis();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const validationError = validateUrl(url);
    setError(validationError);
    if (validationError) return;
    setLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const result = await analyzeUrl(url.trim(), controller.signal);
      setResult(result);
      router.push("/analyze/result");
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") setError("분석 시간이 30초를 초과했습니다. 입력 내용은 유지되었으니 다시 시도해 주세요.");
      else if (caught instanceof AnalysisApiError) setError(caught.message);
      else setError("예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally { window.clearTimeout(timeout); setLoading(false); }
  }

  return <main className="page-container py-12 sm:py-16">
    <div className="mx-auto max-w-3xl">
      <nav aria-label="검사 유형" className="mb-10 flex gap-2 overflow-x-auto border-b border-slate-200">
        <span aria-current="page" className="min-w-max flex-1 border-b-2 border-blue-700 px-4 py-3 text-center font-semibold text-blue-700">URL 검사</span>
        <a href="/analyze/message" className="min-w-max flex-1 px-4 py-3 text-center font-semibold text-slate-600">문자 검사</a>
        <a href="/analyze/qr" className="min-w-max flex-1 px-4 py-3 text-center font-semibold text-slate-600">QR 검사</a>
      </nav>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">URL 검사</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">의심스러운 주소를 입력하세요. 웹페이지에 직접 접속하지 않고 주소 문자열을 분석합니다.</p>
      <form onSubmit={onSubmit} className="mt-9 border-y border-slate-200 py-8" noValidate>
        <label htmlFor="url" className="block font-bold">URL</label>
        <input id="url" name="url" type="url" value={url} disabled={loading} onChange={(event) => { setUrl(event.target.value); if (error) setError(null); }} placeholder="https://example.com" aria-invalid={Boolean(error)} aria-describedby={error ? "url-error url-help" : "url-help"} className={`mt-3 min-h-12 w-full rounded-xl border px-4 text-base transition disabled:bg-slate-100 ${error ? "border-red-600 bg-red-50/40" : "border-slate-300 focus:border-blue-600"}`} />
        <p id="url-help" className="mt-2 text-sm text-slate-500">HTTP 또는 HTTPS 절대 주소를 최대 2,048자까지 입력할 수 있습니다.</p>
        {error && <div id="url-error" role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-800">⚠ {error}</div>}
        <button type="submit" disabled={loading || !url.trim()} className="mt-6 min-h-12 w-full rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">{loading ? "위험 요소를 분석하고 있습니다…" : "URL 검사하기"}</button>
      </form>
      <div className="mt-6 text-sm leading-7 text-slate-600"><strong>개인정보 안내</strong><br />아이디, 비밀번호 등 로그인 정보가 포함된 URL은 입력하지 마세요. URL 원문과 분석 결과는 DB에 저장하지 않습니다.</div>
    </div>
  </main>;
}
