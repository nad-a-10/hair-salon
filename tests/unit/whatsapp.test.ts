import { describe, expect, it } from "vitest";
import {
  phoneToDigits,
  waMeUrl,
  whatsappBusinessAndroidUrl,
  whatsappBusinessIosUrl,
} from "@/lib/booking/whatsapp";

describe("phoneToDigits", () => {
  it("keeps full international numbers with +", () => {
    expect(phoneToDigits("+961 3 071 537")).toBe("9613071537");
    expect(phoneToDigits("+33 6 12 34 56 78")).toBe("33612345678");
  });

  it("strips 00 international prefix", () => {
    expect(phoneToDigits("00961 3 071 537")).toBe("9613071537");
  });

  it("keeps numbers already carrying the country code", () => {
    expect(phoneToDigits("9613071537")).toBe("9613071537");
    expect(phoneToDigits("961 70 123 456")).toBe("96170123456");
  });

  it("converts local numbers with a trunk zero (03…)", () => {
    expect(phoneToDigits("03071537")).toBe("9613071537");
    expect(phoneToDigits("03 071 537")).toBe("9613071537");
  });

  it("converts short local numbers without a trunk zero (70…)", () => {
    expect(phoneToDigits("70123456")).toBe("96170123456");
    expect(phoneToDigits("70 123 456")).toBe("96170123456");
  });

  it("leaves long foreign numbers without + untouched", () => {
    expect(phoneToDigits("15551234567")).toBe("15551234567");
  });
});

describe("link builders", () => {
  it("builds wa.me URLs with encoded text", () => {
    expect(waMeUrl("9613071537", "Hi there")).toBe(
      "https://wa.me/9613071537?text=Hi%20there",
    );
  });

  it("targets the Business package on Android", () => {
    const url = whatsappBusinessAndroidUrl("9613071537");
    expect(url).toContain("package=com.whatsapp.w4b");
    expect(url).toContain("intent://send?phone=9613071537");
  });

  it("uses the Business-only scheme on iOS", () => {
    expect(whatsappBusinessIosUrl("9613071537", "Hi")).toBe(
      "whatsapp-smb://send?phone=9613071537&text=Hi",
    );
  });
});
