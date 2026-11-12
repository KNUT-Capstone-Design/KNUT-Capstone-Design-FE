export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          KNUT Capstone Design
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          프론트엔드 프로젝트가 준비되었습니다.
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Next.js App Router, TypeScript, Tailwind CSS가 적용되어 있습니다.
        </p>
      </section>
    </main>
  );
}
