export type UserRole = "user" | "admin";
export type UserStatus = "active" | "disabled";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login_at: string | null;
};

export type AuthSession = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: AuthUser;
};

type FastApiError = {
  detail?: string | { loc?: (string | number)[]; msg?: string }[];
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null = null,
    public readonly field: "email" | "password" | null = null,
  ) {
    super(message);
  }
}

function apiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
  const baseUrl = (configured ?? (process.env.NODE_ENV === "development" ? "http://localhost:8000" : ""))
    .replace(/\/$/, "");
  if (!baseUrl) {
    throw new AuthApiError("인증 서버 주소가 설정되지 않았습니다. 관리자에게 문의해 주세요.");
  }
  return baseUrl;
}

function errorMessage(status: number, body: FastApiError, retryAfter: string | null) {
  if (status === 401) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (status === 409) return "이미 가입된 이메일입니다. 로그인해 주세요.";
  if (status === 429) {
    const seconds = Number.parseInt(retryAfter ?? "", 10);
    return Number.isFinite(seconds)
      ? `요청이 너무 많습니다. ${seconds}초 후 다시 시도해 주세요.`
      : "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (status === 422 && Array.isArray(body.detail)) {
    const passwordIssue = body.detail.find((issue) => issue.loc?.at(-1) === "password");
    if (passwordIssue) return "비밀번호 조건을 다시 확인해 주세요.";
    return "입력한 내용을 다시 확인해 주세요.";
  }
  if (status >= 500) return "인증 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  return typeof body.detail === "string" ? body.detail : "요청을 처리하지 못했습니다.";
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}/api/v1/auth${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof AuthApiError) throw error;
    throw new AuthApiError("인증 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
  }

  if (!response.ok) {
    let body: FastApiError = {};
    try {
      body = (await response.json()) as FastApiError;
    } catch {
      // A proxy may return a non-JSON response.
    }
    const issue = Array.isArray(body.detail) ? body.detail[0] : null;
    const field = issue?.loc?.at(-1);
    throw new AuthApiError(
      errorMessage(response.status, body, response.headers.get("Retry-After")),
      response.status,
      field === "email" || field === "password" ? field : null,
    );
  }

  return (await response.json()) as T;
}

export function login(email: string, password: string) {
  return request<AuthSession>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signup(email: string, password: string) {
  return request<AuthSession>("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function refreshSession() {
  return request<AuthSession>("/refresh", { method: "POST" });
}

export function logout() {
  return request<{ message: string }>("/logout", { method: "POST" });
}
