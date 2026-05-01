import { getLyrionClient } from "../../../lib/lyrion/client";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ artworkId: string }>;
  },
) {
  const { artworkId } = await params;
  const client = getLyrionClient();
  const url = client.urlForArtworkId(artworkId);
  return fetch(url);
}
