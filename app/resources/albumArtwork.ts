import { getLyrionClient } from "../lib/lyrion/client";
import type { Route } from "./+types/albumArtwork";

export async function loader({ params }: Route.LoaderArgs) {
  const artwork = getLyrionClient().urlForArtworkId(params.artworkId);
  return fetch(artwork);
}
