"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { UrlAnalysisResponse } from "@/lib/analysis";
type Value = { result: UrlAnalysisResponse | null; setResult: (result: UrlAnalysisResponse | null) => void };
const AnalysisContext = createContext<Value | null>(null);
export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<UrlAnalysisResponse | null>(null);
  const value = useMemo(() => ({ result, setResult }), [result]);
  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}
export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysis must be used within AnalysisProvider");
  return context;
}
