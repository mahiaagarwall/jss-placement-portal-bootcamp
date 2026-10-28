import { createClient } from "@supabase/supabase-js";

const clean = (v: unknown) => String(v ?? "").trim().replace(/^["']|["']$/g, "").trim();

/** Accepts "https://abc.supabase.co", "abc.supabase.co" or a bare project ref "abc"; strips quotes, paths and trailing slashes. */
function normalizeSupabaseUrl(raw: string): string | null {
  if (!raw) return null;
  let v = raw;
  if (!/^https?:\/\//i.test(v)) v = /[.:]/.test(v) ? `https://${v}` : `https://${v}.supabase.co`;
  try {
    const u = new URL(v);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.origin; // drops /rest/v1, dashboard paths, trailing slash
  } catch {
    return null;
  }
}

const rawUrl = clean(import.meta.env.VITE_SUPABASE_URL);
const anonKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY);
const url = normalizeSupabaseUrl(rawUrl);

export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabaseHost = url ? new URL(url).host : "(not set)";
export const anonKeyLooksValid = anonKey.length > 40; // real keys are long (JWT "eyJ..." or "sb_publishable_...")

if (!isSupabaseConfigured) {
  const problems = [
    !rawUrl && "VITE_SUPABASE_URL is empty",
    rawUrl && !url && `VITE_SUPABASE_URL is not a valid URL (got "${rawUrl.slice(0, 40)}"; expected https://<project-ref>.supabase.co)`,
    !anonKey && "VITE_SUPABASE_ANON_KEY is empty",
  ].filter(Boolean);
  // eslint-disable-next-line no-console
  console.error(
    `[supabase] ${problems.join("; ")}. Fix .env (see .env.example) and restart "npm run dev". Data requests will fail until then.`,
  );
}

// Read-only, public client: no auth session is persisted or refreshed.
// Placeholders keep the app mountable so pages show their error state instead of crashing on import.
export const supabase = createClient(url ?? "http://localhost:54321", anonKey || "missing-anon-key", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

// eslint-disable-next-line no-console
console.info(`[supabase] host=${supabaseHost} anonKeyLength=${anonKey.length}`);
