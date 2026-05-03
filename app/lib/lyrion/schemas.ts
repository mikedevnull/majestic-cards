import { z } from "zod";

/**
 * Base schema for muting responses
 * The underscore prefix is used by Lyrion API
 */
export const MuteResponseSchema = z.object({
  _muting: z.enum(["0", "1"]).describe("Mute state: 0=unmuted, 1=muted"),
});

export type MuteResponse = z.infer<typeof MuteResponseSchema>;

export const PlayerInfoSchema = z.object({
  modelname: z.string(),
  isplayer: z.coerce.boolean(),
  ip: z.string(),
  uuid: z.string().nullable(),
  isplaying: z.coerce.boolean(),
  displaytype: z.string(),
  firmware: z.any(),
  name: z.string(),
  playerid: z.string(),
  canpoweroff: z.coerce.boolean(),
  power: z.coerce.boolean(),
  connected: z.coerce.boolean(),
  model: z.string(),
  playerindex: z.union([z.number(), z.string()]),
});

export type PlayerInfo = z.infer<typeof PlayerInfoSchema>;

export const PlayerListResponse = z.object({
  players_loop: z.array(PlayerInfoSchema),
  count: z.number(),
});

export const ArtistInfoSchema = z.object({
  id: z.number(),
  textkey: z.string(),
  artist: z.string(),
});

export type ArtistInfo = z.infer<typeof ArtistInfoSchema>;

export const ArtistListResponseSchema = z.object({
  artists_loop: z
    .array(ArtistInfoSchema)
    .optional()
    .transform((x) => x ?? []),
  count: z.number(),
});

export type ArtistListResponse = z.infer<typeof ArtistListResponseSchema>;

export const AlbumInfoSchema = z.object({
  id: z.number(),
  artwork_track_id: z.string().optional(),
  artist: z.string(),
  album: z.string(),
});
export type AlbumInfo = z.infer<typeof AlbumInfoSchema>;

export const AlbumListResponseSchema = z.object({
  albums_loop: z
    .array(AlbumInfoSchema)
    .optional()
    .transform((x) => x ?? []),
  count: z.number(),
});

export type AlbumListResponse = z.infer<typeof AlbumListResponseSchema>;

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
