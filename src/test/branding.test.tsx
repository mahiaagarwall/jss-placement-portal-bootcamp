import { cleanup, render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import App from "@/App";

afterEach(cleanup);

describe("college branding", () => {
  it("ships the JSS University, Noida logo file", () => {
    expect(existsSync("public/jss-university-logo.png")).toBe(true);
  });

  it("shows the logo and name in the listing hero", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    const logo = screen.getByAltText("JSS University, Noida logo");
    expect(logo).toHaveAttribute("src", "/jss-university-logo.png");
    expect(screen.getAllByText("JSS University, Noida").length).toBeGreaterThan(0);
  });

  it("shows the logo and name in the sidebar on company pages", () => {
    localStorage.setItem("selected-company", JSON.stringify({ companyId: 1, companyName: "Accenture plc", logoUrl: "" }));
    window.history.pushState({}, "", "/company/intelligence");
    render(<App />);
    expect(screen.getByAltText("JSS University, Noida logo")).toBeInTheDocument();
    expect(screen.getByText("JSS University, Noida")).toBeInTheDocument();
  });
});
