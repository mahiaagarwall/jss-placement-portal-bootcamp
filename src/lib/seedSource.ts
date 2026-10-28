// PHASE 1 FALLBACK (not used in the live render path since Phase 2).
// The live app reads from Supabase via src/lib/companyApi.ts. This file, src/data/seedCompanies.ts and
// src/data/skillTopics.ts are kept as a documented offline fallback and as test fixtures.
import { SEED_COMPANIES } from "@/data/seedCompanies";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";

export interface CompanyBundle {
  summary: CompanySummary;
  profile: CompanyProfile;
  skills: DashboardSkill[];
}

export async function fetchCompanySummaries(): Promise<CompanySummary[]> {
  return SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id));
}

export function getCompanyBundle(companyId: number): CompanyBundle | null {
  const c = SEED_COMPANIES.find((x) => x.company_id === companyId);
  if (!c) return null;
  return {
    summary: normalizeCompanySummary(c.short_json, c.company_id),
    profile: normalizeCompanyProfile(c.full_json, c.short_json),
    skills: normalizeDashboardSkills(c.skill_levels),
  };
}
