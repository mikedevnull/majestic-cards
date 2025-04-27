import { use, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { loader as PlayerLoader } from "~/routes/api.lyrion.players";
import { LibraryList } from "./libraryList";
import { ClientOnly } from "remix-utils/client-only";
type Props = {
  playerid?: string;
  currentItem?: string;
};

type PlayerSelectorProps = {
  onPlayerSelect: (playerId: string) => void;
};

export default function PlayerSelector({
  onPlayerSelect,
}: PlayerSelectorProps) {
  const fetcher = useFetcher<typeof PlayerLoader>();

  console.log("fetcher", fetcher);
  useEffect(() => {
    console.log("fetcher effect", fetcher.state);
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/api/lyrion/players");
    }
  }, [fetcher]);

  const players = fetcher.data?.map((p) => ({
    name: p.name,
    id: p.playerid,
    target: `/browse/${p.playerid}`,
  }));

  console.log("players", players);
  if (players) {
    return (
      <LibraryList
        items={players}
        onItemClick={(item) => onPlayerSelect(item.id)}
      />
    );
  } else if (fetcher.state === "loading") {
    return <h3>Loading...</h3>;
  } else {
    <h3>{fetcher.state}</h3>;
  }
}

export function LyrionItemSelector() {
  const [playerId, setPlayerId] = useState<string>();

  if (!playerId) {
    return (
      <>
        <h4>Select player</h4>
        <PlayerSelector onPlayerSelect={(playerId) => setPlayerId(playerId)} />
      </>
    );
  }
}
