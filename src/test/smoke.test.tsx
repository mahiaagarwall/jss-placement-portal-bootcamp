import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { buildIntelligenceSections } from "@/data/intelligenceData";
import { normalizeCompanyProfile, normalizeDashboardSkills, proficiencyToBloom, scoreToCriticality } from "@/lib/companyData";
import { SEED_COMPANIES } from "@/data/seedCompanies";

describe("smoke", () => {
  it("renders the home hero and Accenture card", async () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /JSS University, Noida Companies Research & Placement Analytics Portal/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Accenture plc")).toBeInTheDocument();
  });

  it("builds 22 sections and 12 skills from the seed", () => {
    const c = SEED_COMPANIES[0];
    const sections = buildIntelligenceSections(normalizeCompanyProfile(c.full_json, c.short_json));
    expect(sections).toHaveLength(22);
    expect(normalizeDashboardSkills(c.skill_levels)).toHaveLength(12);
    expect(proficiencyToBloom(7)).toBe("EV");
    expect(scoreToCriticality(5)).toBe("Important");
  });
});
