import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/ThemeToggle";
import App from "@/App";

const mockSystemDark = (dark: boolean) =>
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: dark && q.includes("dark"), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    onchange: null, dispatchEvent: () => false,
  }));

beforeEach(() => { localStorage.clear(); document.documentElement.classList.remove("dark"); mockSystemDark(false); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("theme toggle", () => {
  it("switches light <-> dark immediately and persists the choice", () => {
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: /switch to dark mode/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: /switch to light mode/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("restores the saved theme after a refresh (remount)", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it("follows the system preference only when nothing is saved", () => {
    mockSystemDark(true);
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    cleanup();
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light"); // saved choice wins over system dark
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("is available on the listing page and on the company pages", async () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByRole("button", { name: /dark mode/i })).toBeInTheDocument();
    cleanup();
    localStorage.setItem("selected-company", JSON.stringify({ companyId: 1, companyName: "Accenture plc", logoUrl: "" }));
    window.history.pushState({}, "", "/company/intelligence");
    render(<App />);
    expect(screen.getByRole("button", { name: /dark mode/i })).toBeInTheDocument();
  });
});
