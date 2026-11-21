export type Level = "safe" | "caution" | "danger";
export type Risk = {
  score: number; base_level: Level; level: Level; overridden: boolean;
  critical_rule_ids: string[]; summary: string;
  findings: { rule_id: string; severity: "info" | "warning" | "critical"; description: string }[];
  recommendations: { code: string; message: string }[];
};
export type UrlAnalysisResponse = {
  request_id: string;
  data: {
    type: "url"; status: "completed" | "partial"; analyzed_at: string; analysis_version: string;
    risk: Risk; reputation_status: "disabled" | "completed" | "partial" | "failed";
    warnings: { code: string; message: string }[];
    details: { normalized_url: string; hostname: string; scheme: "http" | "https" };
  };
};
type ApiErrorBody = { error?: { message?: string; field?: string | null; retryable?: boolean } };
export class AnalysisApiError extends Error {
  constructor(message: string, public readonly field: string | null = null, public readonly retryable = false) { super(message); }
}
export async function analyzeUrl(url: string, signal: AbortSignal): Promise<UrlAnalysisResponse> {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
  const baseUrl = (configured ?? (process.env.NODE_ENV === "development" ? "http://localhost:8000" : ""))
    .replace(/\/$/, "");
  if (!baseUrl) throw new AnalysisApiError("분석 서버 주소가 설정되지 않았습니다. 잠시 후 다시 시도해 주세요.", null, true);
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/v1/analysis/url`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }), cache: "no-store", signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new AnalysisApiError("분석 서버에 연결할 수 없습니다. 입력 내용은 유지되었으니 잠시 후 다시 시도해 주세요.", null, true);
  }
  if (!response.ok) {
    let body: ApiErrorBody = {};
    try { body = (await response.json()) as ApiErrorBody; } catch { /* non-JSON proxy error */ }
    throw new AnalysisApiError(body.error?.message ?? "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", body.error?.field ?? null, body.error?.retryable ?? response.status >= 500);
  }
  return (await response.json()) as UrlAnalysisResponse;
}
