// src/setupTests.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock i18next
vi.mock("@/i18n/i18n.ts", () => ({
  default: { language: "en", t: (key: string) => key },
}));

// Mock uuid to return predictable id
vi.mock("uuid", () => ({
  v4: () => "mock-uuid",
}));
