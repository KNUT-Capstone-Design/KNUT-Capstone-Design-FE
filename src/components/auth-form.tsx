"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { AuthApiError } from "@/lib/auth";

type Props = { mode: "login" | "signup" };
type Field = "email" | "password" | "confirmation";

export function AuthForm({ mode }: Props) {
  const signup = mode === "signup";
  const router = useRouter();
  const auth = useAuth();
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const title = signup ? "회원가입" : "로그인";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    const next: Partial<Record<Field, string>> = {};
    if (!email) next.email = "이메일을 입력해 주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "이메일 주소를 확인해 주세요.";
    if (!password) next.password = "비밀번호를 입력해 주세요.";
    else if (Array.from(password).length > 128) next.password = "비밀번호는 최대 128자까지 입력할 수 있습니다.";
    else if (signup && Array.from(password).length < 10) next.password = "비밀번호는 10자 이상이어야 합니다.";
    else if (signup && (!/\p{L}/u.test(password) || !/\p{N}/u.test(password))) {
      next.password = "비밀번호에 문자와 숫자를 각각 하나 이상 포함해 주세요.";
    }
    if (signup && !confirmation) next.confirmation = "비밀번호를 한 번 더 입력해 주세요.";
    else if (signup && password !== confirmation) next.confirmation = "비밀번호가 일치하지 않습니다.";
    setErrors(next);
    setNotice("");
    const first = (["email", "password", "confirmation"] as const).find((field) => next[field]);
    if (first) {
      (formRef.current?.elements.namedItem(first) as HTMLInputElement | null)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      if (signup) await auth.signup(email.toLowerCase(), password);
      else await auth.login(email.toLowerCase(), password);
      form.reset();
      router.replace("/");
    } catch (error) {
      const message = error instanceof AuthApiError
        ? error.message
        : "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
      setNotice(message);
      if (error instanceof AuthApiError && error.field) {
        setErrors((previous) => ({ ...previous, [error.field!]: message }));
        (formRef.current?.elements.namedItem(error.field) as HTMLInputElement | null)?.focus();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function clear(field: Field) {
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setNotice("");
  }

  return (
    <main className="page-container auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <header className="auth-heading">
          <h1 id="auth-title">{title}</h1>
          <p>{signup ? "안심링크에서 함께 예방 습관을 만들어 가요." : "다시 만나 반가워요."}</p>
        </header>
        <form ref={formRef} onSubmit={submit} noValidate className="auth-form">
          <div className="auth-field">
            <label htmlFor="auth-email">이메일</label>
            <input id="auth-email" name="email" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} placeholder="name@example.com" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={() => clear("email")} />
            {errors.email && <p className="auth-error" id="email-error">{errors.email}</p>}
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">비밀번호</label>
            <div className="password-input">
              <input id="auth-password" name="password" type={visible ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} required aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} onChange={() => clear("password")} />
              <button type="button" aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"} aria-pressed={visible} aria-controls="auth-password" onClick={() => setVisible((value) => !value)}>{visible ? "숨기기" : "보기"}</button>
            </div>
            {errors.password && <p className="auth-error" id="password-error">{errors.password}</p>}
            {signup && !errors.password && <p className="auth-help">10~128자, 문자와 숫자를 각각 하나 이상 포함해 주세요.</p>}
          </div>
          {signup && <div className="auth-field">
            <label htmlFor="auth-confirmation">비밀번호 확인</label>
            <input id="auth-confirmation" name="confirmation" type="password" autoComplete="new-password" required aria-invalid={Boolean(errors.confirmation)} aria-describedby={errors.confirmation ? "confirmation-error" : undefined} onChange={() => clear("confirmation")} />
            {errors.confirmation && <p className="auth-error" id="confirmation-error">{errors.confirmation}</p>}
          </div>}
          {notice && <p role="alert" className="auth-notice">{notice}</p>}
          <button className="primary-action auth-submit" type="submit" disabled={submitting}>{submitting ? "처리 중…" : title}</button>
        </form>
        <p className="auth-switch">{signup ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"} <Link href={signup ? "/login" : "/signup"}>{signup ? "로그인" : "회원가입"}</Link></p>
        <div className="auth-guest">
          <p>URL 검사와 공개 교육은 로그인 없이 이용할 수 있어요.</p>
          <Link href="/analyze/url">로그인 없이 검사하기</Link>
        </div>
      </section>
    </main>
  );
}
