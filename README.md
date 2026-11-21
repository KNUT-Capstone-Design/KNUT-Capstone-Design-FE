# KNUT Capstone Design Frontend

Next.js App Router, TypeScript, Tailwind CSS 기반 프론트엔드 프로젝트입니다.

## 실행

```bash
cp .env.example .env.local
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

`NEXT_PUBLIC_API_BASE_URL`에는 `/api/v1`을 제외한 Backend origin을 설정합니다.
로컬 개발에서는 설정하지 않으면 `http://localhost:8000`을 사용하며, 배포 환경에서는 반드시 설정해야 합니다.
