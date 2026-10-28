import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { fakeSupabase } from "./fakeSupabase";

// jsdom lacks these; components call them.
window.HTMLElement.prototype.scrollIntoView = () => {};
window.HTMLElement.prototype.scrollTo = (() => {}) as typeof window.HTMLElement.prototype.scrollTo;

// All tests run against an in-memory Supabase built from the seed (no network).
vi.mock("@/lib/supabaseClient", () => ({ supabase: fakeSupabase, isSupabaseConfigured: true }));
