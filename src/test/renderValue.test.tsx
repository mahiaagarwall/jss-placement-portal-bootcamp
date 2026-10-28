import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderValue } from "@/pages/CompanyIntelligence";

const text = (value: string) => {
  const { container } = render(<div>{renderValue({ key: "k", label: "L", type: "auto", value })}</div>);
  return container;
};

describe("renderValue", () => {
  it("keeps numbers with thousands separators as one value", () => {
    expect(text("740,000 employees").textContent).toBe("740,000 employees");
    expect(text("740,000 employees").querySelectorAll("span.rounded-full")).toHaveLength(0);
  });
  it("still turns short comma / semicolon lists into pills", () => {
    expect(text("Dublin, Ireland").querySelectorAll("span.rounded-full")).toHaveLength(2);
    expect(text("A; B; C").querySelectorAll("span.rounded-full")).toHaveLength(3);
  });
  it("shows Not Available for nullish values", () => {
    expect(text("NA").textContent).toBe("Not Available");
  });
});
