import { z } from "zod";

const PlayerSchema = z.object({
  name: z.string(),
  isplayer: z.coerce.boolean(),
  power: z.coerce.boolean(),
  connected: z.coerce.boolean(),
  firmware: z.number(),
  canpoweroff: z.coerce.boolean(),
  playerindex: z.coerce.number(),
  ip: z.string(),
  modelname: z.string(),
  isplaying: z.coerce.boolean(),
  playerid: z.string(),
  model: z.string(),
});
type Player = z.infer<typeof PlayerSchema>;

const BaseReponseSchema = z.object({
  id: z.number(),
  params: z.array(z.any()),
  method: z.literal("slim.request"),
});

const PlayerResultSchema = BaseReponseSchema.extend({
  result: z.object({
    count: z.number(),
    players_loop: z.optional(z.array(PlayerSchema)),
  }),
});

class LyrionServer {
  private readonly _apiBase: URL;
  constructor(lyrionUrl: string) {
    this._apiBase = new URL("jsonrpc.js", lyrionUrl);
  }
  async getPlayers(): Promise<Player[]> {
    const request = {
      id: 1,
      method: "slim.request",
      params: [0, ["players", "0"]],
    };
    const response = await fetch(this._apiBase, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    const payload = PlayerResultSchema.parse(data);
    return payload.result.players_loop || [];
  }
}

export const serverApi = new LyrionServer(
  process.env.LYRION_URL || "http://music.bluesheep.home"
);
