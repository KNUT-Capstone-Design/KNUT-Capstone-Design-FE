import Link from "next/link";
import { MessageIllustration } from "@/components/message-illustration";

export default function Home() {
  return (
    <main className="page-container home">
      <section className="home-intro">
        <div>
          <h1>누르기 전에,<br />한 번만 확인하세요.</h1>
          <p>갑자기 온 배송 안내, 낯선 사람이 보낸 주소.<br className="hidden sm:block" /> 의심되는 링크의 위험 요소를 함께 확인합니다.</p>
        </div>
        <aside className="intro-note">
          <MessageIllustration />
          <p>보낸 사람을 알아도<br /><strong>링크는 한 번 더 확인하세요.</strong></p>
          <span>가족이나 기관을 사칭한 문자일 수 있습니다.</span>
        </aside>
      </section>

      <section aria-labelledby="check-heading" className="check-section">
        <div className="section-heading">
          <h2 id="check-heading">어떤 내용을 받으셨나요?</h2>
          <p>로그인 없이 검사할 수 있습니다.</p>
        </div>
        <div className="check-options">
          <article className="check-option">
            <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m13 19 6-6M11 22l-2 2a6 6 0 0 1-8-8l6-6a6 6 0 0 1 8 0M21 10l2-2a6 6 0 0 1 8 8l-6 6a6 6 0 0 1-8 0" transform="translate(0 -1)" /></svg>
            <h3>웹사이트 주소</h3>
            <p>받은 주소를 복사해 붙여넣으세요.<br />해당 사이트에 접속하지 않고 검사합니다.</p>
            <Link className="primary-action" href="/analyze/url">URL 검사하기</Link>
          </article>
          <article className="check-option">
            <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 5h22v17H14l-7 5v-5H5zM10 11h12M10 16h8" /></svg>
            <h3>문자 메시지</h3>
            <p>받은 문자를 통째로 확인할 수 있어요.<br />개인정보는 지우고 입력해 주세요.</p>
            <Link className="secondary-action" href="/analyze/message">문자 검사 <span className="availability">준비 중</span></Link>
          </article>
          <article className="check-option">
            <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h9v9H4zM19 4h9v9h-9zM4 19h9v9H4zM19 19h5v5h4v4h-9v-4M28 19v2" /></svg>
            <h3>QR 코드 이미지</h3>
            <p>카메라로 바로 열기 전에 확인하세요.<br />QR 코드가 담긴 사진을 사용합니다.</p>
            <Link className="secondary-action" href="/analyze/qr">QR 검사 <span className="availability">준비 중</span></Link>
          </article>
        </div>
        <p className="check-disclaimer">검사 결과는 참고 정보입니다. 위험 신호가 발견되지 않아도 안전을 보장하지 않습니다.</p>
      </section>

      <section className="learn-section" aria-labelledby="learn-heading">
        <div>
          <h2 id="learn-heading">수상한 문자를 구별하는 습관</h2>
          <p>서두르라는 말이 보이면, 잠깐 멈추세요.</p>
          <div className="learning-links">
            <Link href="/education">스미싱 사례 알아보기</Link>
            <Link href="/quiz">예방 퀴즈 풀기</Link>
          </div>
        </div>
        <ul className="prevention-list">
          <li><strong>“오늘까지 확인하지 않으면…”</strong><p>불안하게 만들거나 결정을 재촉하는 문구를 주의하세요.</p></li>
          <li><strong>“아래 링크에서 앱을 설치하세요”</strong><p>문자로 받은 설치 파일은 실행하지 마세요.</p></li>
          <li><strong>“인증번호를 알려주세요”</strong><p>비밀번호와 인증번호는 다른 사람에게 전달하지 마세요.</p></li>
        </ul>
      </section>
    </main>
  );
}
