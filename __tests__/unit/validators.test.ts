import { validateEmail, validatePhone, formatCurrency, generateId } from "@/lib/utils";

describe("Validators", () => {
  it("validates correct email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
  });

  it("validates phone numbers", () => {
    expect(validatePhone("(555) 123-4567")).toBe(true);
    expect(validatePhone("abc")).toBe(false);
  });

  it("formats currency correctly", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(0.5)).toBe("$0.50");
  });
});
