import { useEffect, useMemo, useState } from "react";
import { SearchX, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyCard } from "@/components/CompanyCard";
import { type CompanyCategory } from "@/lib/companyData";
import { useCompanies } from "@/lib/companyApi";
import { PageError } from "@/components/QueryState";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CollegeLogo, COLLEGE_NAME } from "@/components/CollegeLogo";
import { categoryVar } from "@/lib/categoryStyle";

const FILTERS = ["All", "Super Dream", "Dream", "Standard", "Regular"] as const;
type Filter = (typeof FILTERS)[number];

const Index = () => {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [input]);

  const { data, isLoading, isError, refetch } = useCompanies();
  const companies = useMemo(() => data ?? [], [data]);

  const searched = useMemo(
    () =>
      query
        ? companies.filter((c) => [c.name, c.shortName, c.headquarters, c.companyType].some((v) => v.toLowerCase().includes(query)))
        : companies,
    [companies, query],
  );
  const counts = useMemo(() => {
    const m: Record<Filter, number> = { All: searched.length, "Super Dream": 0, Dream: 0, Standard: 0, Regular: 0 };
    searched.forEach((c) => (m[c.companyType] += 1));
    return m;
  }, [searched]);
  const visible = useMemo(() => (filter === "All" ? searched : searched.filter((c) => c.companyType === filter)), [searched, filter]);

  const reset = () => {
    setInput("");
    setQuery("");
    setFilter("All");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b border-border bg-surface">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-[-8rem] h-72 w-72 rounded-full bg-indigo/10 blur-3xl" />
        <div className="container relative py-8 sm:py-12 lg:py-14">
          <div className="flex flex-wrap items-center gap-3">
            <CollegeLogo className="h-14 w-14 sm:h-16 sm:w-16" />
            <span className="font-heading text-base font-semibold tracking-tight text-foreground sm:text-lg">{COLLEGE_NAME}</span>
            <span className="rounded-full border border-primary/30 bg-subtle px-3 py-1 text-[11px] font-semibold tracking-wider text-primary">
              JSS NOIDA · INTELLIGENCE PLATFORM
            </span>
            <div className="ml-auto"><ThemeToggle /></div>
          </div>
          <h1 className="mt-5 max-w-4xl text-balance text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {COLLEGE_NAME} Companies <span className="whitespace-nowrap">Research &amp;</span> <span className="text-primary">Placement Analytics Portal</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">Your strategic edge for campus placements</p>

          <div className="relative mt-7 max-w-2xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search companies by name, location or category"
              aria-label="Search companies"
              className="h-12 pl-10 pr-10 text-sm shadow-card sm:text-base"
            />
            {input && (
              <button
                onClick={() => setInput("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter by category">
          {FILTERS.map((f) => {
            const active = filter === f;
            const c = categoryVar(f as CompanyCategory | "All");
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active
                    ? "border-[hsl(var(--c))] bg-[hsl(var(--c))] text-[hsl(var(--on-cat))] shadow-card"
                    : "border-[hsl(var(--c)/0.35)] bg-card text-[hsl(var(--c))] hover:border-[hsl(var(--c)/0.7)] hover:bg-[hsl(var(--c)/0.1)]"
                }`}
                style={{ "--c": c } as React.CSSProperties}
              >
                {f} <span className="ml-1 tabular-nums opacity-80">({counts[f]})</span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-xl" />)
          ) : isError ? (
            <div className="col-span-full"><PageError message="Could not load companies." onRetry={() => refetch()} /></div>
          ) : visible.length > 0 ? (
            visible.map((c) => <CompanyCard key={c.companyId} company={c} />)
          ) : companies.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-4 py-16 text-center" role="status">
              <SearchX className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">The database returned no companies</p>
              <p className="max-w-md text-sm text-muted-foreground">
                The request worked but came back empty. Either <code>company_json</code> has no rows, or Row Level Security is
                blocking the anon key (add a SELECT policy for the <code>anon</code> role).
              </p>
              <Button variant="outline" onClick={() => refetch()}>Retry</Button>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card py-16 text-center">
              <SearchX className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No companies match your search</p>
              <Button variant="outline" onClick={reset}>Reset filters</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
