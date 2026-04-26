import { z } from "zod";

/**
 * Base schema for muting responses
 * The underscore prefix is used by Lyrion API
 */
export const MuteResponseSchema = z.object({
  _muting: z.enum(["0", "1"]).describe("Mute state: 0=unmuted, 1=muted"),
});

export type MuteResponse = z.infer<typeof MuteResponseSchema>;

/**
 * Schema map for easy lookup by command type
 */

export const JsonRpcResponseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  method: z.literal("slim.request"),
  params: z.tuple([z.string(), z.array(z.string())]),
  result: z.record(z.string(), z.any()),
});

export type JsonRpcResponse = z.infer<typeof JsonRpcResponseSchema>;
