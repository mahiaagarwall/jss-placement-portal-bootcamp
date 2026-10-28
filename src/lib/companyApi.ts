// Phase 2 data-access layer. READ-ONLY.
// Company data: ONLY public.company_json (short_json / full_json). No joins across the normalized tables.
// Skill data: company_skill_levels + skill_set_master + proficiency_levels + skill_set_topics.
import { useQuery } from "@tanstack/react-query";
import { supabase, supabaseHost } from "@/lib/supabaseClient";
import {
  asRecord,
  asString,
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";

export interface SkillTopic {
  level_number: number;
  topic: string;
}

export interface CompanyDetail {
  summary: CompanySummary;
  profile: CompanyProfile;
}

export interface CompanySkillsData {
  skills: DashboardSkill[];
  /** keyed by skill_set_id, levels 1..10 in order */
  topics: Record<number, SkillTopic[]>;
}

// ---------- fetchers ----------

export async function fetchCompanies(): Promise<CompanySummary[]> {
  const { data, error, status } = await supabase.from("company_json").select("company_id, short_json").order("company_id");
  if (error) {
    // eslint-disable-next-line no-console
    console.error(`[supabase] company_json on ${supabaseHost} failed (HTTP ${status}): ${error.message}`);
    throw new Error(error.message);
  }
  if (!data || data.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`[supabase] company_json on ${supabaseHost} returned 0 rows (HTTP ${status}, no error). If the table has data, Row Level Security is likely blocking the anon role.`);
  }
  return (data ?? []).map((row) => normalizeCompanySummary(row.short_json, Number(row.company_id)));
}

export async function fetchCompanyDetail(companyId: number): Promise<CompanyDetail | null> {
  const { data, error } = await supabase
    .from("company_json")
    .select("company_id, short_json, full_json")
    .eq("company_id", companyId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    summary: normalizeCompanySummary(data.short_json, Number(data.company_id)),
    profile: normalizeCompanyProfile(data.full_json, data.short_json),
  };
}

const topicText = (v: unknown): string => (Array.isArray(v) ? v.map(asString).filter(Boolean).join("; ") : asString(v));

export async function fetchCompanySkills(companyId: number): Promise<CompanySkillsData> {
  // 1. which skills (and target level) this company needs
  const levels = await supabase
    .from("company_skill_levels")
    .select("company_id, skill_set_id, required_level, required_proficiency_level_id")
    .eq("company_id", companyId);
  if (levels.error) throw new Error(levels.error.message);
  const levelRows = levels.data ?? [];
  if (levelRows.length === 0) return { skills: [], topics: {} };

  const skillIds = [...new Set(levelRows.map((r) => Number(r.skill_set_id)))];

  // 2. lookups: skill names, proficiency names, 10-level topic ladders
  const [master, prof, topics] = await Promise.all([
    supabase.from("skill_set_master").select("skill_set_id, skill_set_name, short_name").in("skill_set_id", skillIds),
    supabase.from("proficiency_levels").select("proficiency_level_id, proficiency_name, proficiency_code"),
    supabase.from("skill_set_topics").select("skill_set_id, level_number, topics").in("skill_set_id", skillIds).order("level_number"),
  ]);
  for (const r of [master, prof, topics]) if (r.error) throw new Error(r.error.message);

  const nameById = new Map((master.data ?? []).map((r) => [Number(r.skill_set_id), asString(r.skill_set_name) || asString(r.short_name)]));
  const profById = new Map((prof.data ?? []).map((r) => [Number(r.proficiency_level_id), asString(r.proficiency_name) || asString(r.proficiency_code)]));

  // 3. assemble the same raw shape the seed's skill_levels had, then reuse the existing normalizer
  const raw = levelRows.map((r) => ({
    skill_set_id: Number(r.skill_set_id),
    skill_set_name: nameById.get(Number(r.skill_set_id)) ?? "",
    required_level: Number(r.required_level),
    required_proficiency: profById.get(Number(r.required_proficiency_level_id)) ?? "",
  }));

  const ladders: Record<number, SkillTopic[]> = {};
  for (const r of topics.data ?? []) {
    const id = Number(asRecord(r).skill_set_id);
    (ladders[id] ??= []).push({ level_number: Number(r.level_number), topic: topicText(r.topics) });
  }
  for (const id of Object.keys(ladders)) ladders[Number(id)].sort((a, b) => a.level_number - b.level_number);

  return { skills: normalizeDashboardSkills(raw), topics: ladders };
}

// ---------- React Query hooks (QueryClient defaults: staleTime 5m, gcTime 10m, retry 1) ----------

export const useCompanies = () => useQuery({ queryKey: ["companies"], queryFn: fetchCompanies });

export const useCompanyProfile = (companyId?: number) =>
  useQuery({
    queryKey: ["company-profile", companyId],
    queryFn: () => fetchCompanyDetail(companyId as number),
    enabled: typeof companyId === "number",
  });

export const useCompanySkills = (companyId?: number) =>
  useQuery({
    queryKey: ["company-skills", companyId],
    queryFn: () => fetchCompanySkills(companyId as number),
    enabled: typeof companyId === "number",
  });
