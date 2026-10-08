import { describe, expect, it, vi } from "vitest";
import type jsPDF from "jspdf";
import { addNorcoLogo } from "./pathway-pdf";

describe("PDF logo aspect ratio", () => {
  it("preserves the native 761:200 ratio inside the 112 by 40 header box", () => {
    const addImage = vi.fn();
    const doc = { addImage } as unknown as jsPDF;
    const width = addNorcoLogo(doc, { dataUrl: "logo", width: 761, height: 200 }, 34, 20, 112, 40);
    expect(width).toBe(112);
    const args = addImage.mock.calls[0];
    expect(args?.[5]).toBe(112);
    expect(args?.[6]).toBeCloseTo(112 * 200 / 761);
    expect(Number(args?.[5]) / Number(args?.[6])).toBeCloseTo(761 / 200);
  });
});