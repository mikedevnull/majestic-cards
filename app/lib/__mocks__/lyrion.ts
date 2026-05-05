// lib/__mocks__/lyrion.ts
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { LyrionClient } from "../lyrion/client";

beforeEach(() => {
  mockReset(lyrionClient);
});

const lyrionClient = mockDeep<LyrionClient>();
export default lyrionClient;
