import { serverApi } from "~/lib/lyrion.server";

export const loader = async () => {
  return await serverApi.getPlayers();
};
