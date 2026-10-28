import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CompanyLogo, logoSources } from "@/components/CompanyLogo";

afterEach(cleanup);

describe("CompanyLogo fallback chain", () => {
  it("orders: stored logo_url, then the site's icon, with no duplicates", () => {
    const s = logoSources("https://www.tcs.com/about", "https://cdn.example.com/tcs-logo.svg");
    expect(s[0]).toBe("https://cdn.example.com/tcs-logo.svg");
    expect(s[1]).toContain("faviconV2");
    expect(s[1]).toContain(encodeURIComponent("https://tcs.com"));
    expect(new Set(s).size).toBe(s.length);
  });

  it("walks the chain on image errors and ends on the letter circle", () => {
    render(<CompanyLogo name="TCS" websiteUrl="https://www.tcs.com" logoUrl="https://cdn.example.com/tcs-logo.svg" />);
    let img = screen.getByAltText("TCS logo");
    expect(img).toHaveAttribute("src", "https://cdn.example.com/tcs-logo.svg");
    expect(img).toHaveAttribute("referrerpolicy", "no-referrer");
    fireEvent.error(img);
    img = screen.getByAltText("TCS logo");
    expect(img.getAttribute("src")).toContain("faviconV2");
    fireEvent.error(img);
    expect(screen.queryByAltText("TCS logo")).toBeNull();
    expect(screen.getByLabelText("TCS")).toHaveTextContent("T");
  });

  it("falls back to the letter when there is no url or website at all", () => {
    render(<CompanyLogo name="Fractal" />);
    expect(screen.getByLabelText("Fractal")).toHaveTextContent("F");
  });
});
