"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

type Props = { mode: "login" | "signup" };
type Field = "email" | "password" | "confirmation";

export function AuthForm({ mode }: Props) {
  const signup = mode === "signup";
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const title = signup ? "회원가입" : "로그인";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    const next: Partial<Record<Field, string>> = {};
    if (!email) next.email = "이메일을 입력해 주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "이메일 주소를 확인해 주세요.";
    if (!password) next.password = "비밀번호를 입력해 주세요.";
    if (signup && !confirmation) next.confirmation = "비밀번호를 한 번 더 입력해 주세요.";
    else if (signup && password !== confirmation) next.confirmation = "비밀번호가 일치하지 않습니다.";
    setErrors(next);
    setNotice("");
    const first = (["email", "password", "confirmation"] as const).find((field) => next[field]);
    if (first) {
      (formRef.current?.elements.namedItem(first) as HTMLInputElement | null)?.focus();
      return;
    }
    // UI only: never send or persist credentials until the auth contract is agreed.
    setNotice(signup
      ? "회원가입 서비스를 준비하고 있습니다. 입력하신 정보는 전송되거나 저장되지 않았습니다."
      : "로그인 서비스를 준비하고 있습니다. 입력하신 정보는 전송되거나 저장되지 않았습니다.");
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
        <p className="auth-availability">회원 서비스 준비 중 · 현재는 입력 화면만 확인할 수 있습니다.</p>
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
          </div>
          {signup && <div className="auth-field">
            <label htmlFor="auth-confirmation">비밀번호 확인</label>
            <input id="auth-confirmation" name="confirmation" type="password" autoComplete="new-password" required aria-invalid={Boolean(errors.confirmation)} aria-describedby={errors.confirmation ? "confirmation-error" : undefined} onChange={() => clear("confirmation")} />
            {errors.confirmation && <p className="auth-error" id="confirmation-error">{errors.confirmation}</p>}
          </div>}
          {notice && <p role="status" className="auth-notice">{notice}</p>}
          <button className="primary-action auth-submit" type="submit">{title}</button>
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
