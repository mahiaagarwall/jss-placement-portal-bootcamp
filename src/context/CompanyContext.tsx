import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

export const SELECTED_COMPANY_KEY = "selected-company";

/** Reads localStorage. Returns null if missing/invalid. The company itself is loaded from Supabase by the page hooks. */
export function readSelectedCompany(): SelectedCompany | null {
  try {
    const raw = localStorage.getItem(SELECTED_COMPANY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCompany>;
    const id = Number(parsed.companyId);
    if (!Number.isFinite(id) || id <= 0) return null;
    return {
      companyId: id,
      companyName: String(parsed.companyName ?? ""),
      logoUrl: String(parsed.logoUrl ?? ""),
    };
  } catch {
    return null;
  }
}

export function writeSelectedCompany(c: SelectedCompany | null) {
  try {
    if (c) localStorage.setItem(SELECTED_COMPANY_KEY, JSON.stringify(c));
    else localStorage.removeItem(SELECTED_COMPANY_KEY);
  } catch {
    /* storage unavailable: context state still works for this session */
  }
}

interface CompanyContextValue {
  selected: SelectedCompany | null;
  selectCompany: (c: SelectedCompany) => void;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  // Restore on startup from localStorage
  const [selected, setSelected] = useState<SelectedCompany | null>(() => readSelectedCompany());

  const selectCompany = useCallback((c: SelectedCompany) => {
    writeSelectedCompany(c); // persist first; never rely solely on React state
    setSelected(c);
  }, []);

  const clearCompany = useCallback(() => {
    writeSelectedCompany(null);
    setSelected(null);
  }, []);

  const value = useMemo(() => ({ selected, selectCompany, clearCompany }), [selected, selectCompany, clearCompany]);
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
};
