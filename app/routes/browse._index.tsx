import { useEffect } from "react";
import { useFetcher } from "react-router";
import { LibraryList } from "~/components/libraryList";
import type { loader } from "~/routes/api.lyrion.players";

export default function Index() {
  const fetcher = useFetcher<typeof loader>();
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/api/lyrion/players");
    }
  }, [fetcher]);
  const players = fetcher.data?.map((p) => ({
    name: p.name,
    id: p.playerid,
    target: `/browse/${p.playerid}`,
  }));

  return players && <LibraryList items={players} />;
}
