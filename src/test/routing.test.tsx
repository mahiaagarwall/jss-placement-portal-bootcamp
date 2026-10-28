import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "@/App";
import { queriedTables, selectLog } from "./fakeSupabase";

const go = (path: string) => window.history.pushState({}, "", path);

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("routing", () => {
  it("click on Accenture navigates to /company/intelligence and persists selection", async () => {
    go("/");
    render(<App />);
    fireEvent.click(await screen.findByTestId("company-card-1"));
    expect(window.location.pathname).toBe("/company/intelligence");
    expect(JSON.parse(localStorage.getItem("selected-company")!).companyId).toBe(1);
    await waitFor(() => expect(document.querySelectorAll("section[data-section]")).toHaveLength(22));
    expect(screen.getAllByRole("tab")).toHaveLength(22);
  });

  it("refresh on /company/intelligence and /company/skills still loads data", async () => {
    localStorage.setItem("selected-company", JSON.stringify({ companyId: 1, companyName: "Accenture plc", logoUrl: "" }));
    go("/company/intelligence");
    render(<App />);
    await waitFor(() => expect(document.querySelectorAll("section[data-section]")).toHaveLength(22));
    cleanup();

    go("/company/skills");
    render(<App />);
    expect(await screen.findByRole("heading", { name: /Accenture Skill Intelligence/i })).toBeInTheDocument();
    const cards = screen.getAllByTestId("skill-card");
    expect(cards).toHaveLength(12);
    fireEvent.click(within(cards[0]).getByRole("button"));
    expect(within(cards[0]).getAllByRole("listitem")).toHaveLength(10);
    // highest required level first; DSA is 8/10 -> levels 9 and 10 are locked
    expect(within(cards[0]).getByText("Data Structures & Algorithms")).toBeInTheDocument();
    expect(within(cards[0]).getAllByText("Beyond scope")).toHaveLength(2);
  });

  it("/company redirects to /company/intelligence", async () => {
    localStorage.setItem("selected-company", JSON.stringify({ companyId: 1, companyName: "Accenture plc", logoUrl: "" }));
    go("/company");
    render(<App />);
    expect(window.location.pathname).toBe("/company/intelligence");
    await waitFor(() => expect(document.querySelectorAll("section[data-section]")).toHaveLength(22));
  });

  it("missing selection sends company pages to / (not 404)", () => {
    go("/company/skills");
    render(<App />);
    expect(window.location.pathname).toBe("/");
    expect(screen.queryByText("Page not found")).toBeNull();
  });

  it("only invalid URLs hit NotFound; /login and /dashboard are not routes", () => {
    for (const p of ["/login", "/dashboard", "/nope"]) {
      go(p);
      render(<App />);
      expect(screen.getByText("Page not found")).toBeInTheDocument();
      cleanup();
    }
  });

  it("queries only company_json and the 4 skill tables, and never fetches full_json for the list", async () => {
    // (log is not reset: the app's QueryClient caches results across tests, so earlier tests already populated it)
    go("/");
    render(<App />);
    fireEvent.click(await screen.findByTestId("company-card-1"));
    await waitFor(() => expect(document.querySelectorAll("section[data-section]")).toHaveLength(22));
    go("/company/skills");
    cleanup();
    render(<App />);
    await screen.findAllByTestId("skill-card");

    const allowed = new Set(["company_json", "company_skill_levels", "skill_set_master", "proficiency_levels", "skill_set_topics"]);
    expect(queriedTables.length).toBeGreaterThan(0);
    for (const t of queriedTables) expect(allowed.has(t)).toBe(true);
    expect(new Set(queriedTables)).toEqual(allowed);

    // the list/cards query reads short_json only; full_json is fetched per company by id
    const jsonSelects = selectLog.filter((q) => q.table === "company_json");
    expect(jsonSelects.some((q) => q.cols.includes("short_json") && !q.cols.includes("full_json"))).toBe(true);
    expect(jsonSelects.some((q) => q.cols.includes("full_json"))).toBe(true);
  });
});
