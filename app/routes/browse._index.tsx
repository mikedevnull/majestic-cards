import { useLoaderData } from "react-router";
import { LibraryList } from "~/components/libraryList";
import { serverApi } from "~/lib/lyrion.server";

export const loader = async () => {
  return await serverApi.getPlayers();
};

export default function Index() {
  const players = useLoaderData<typeof loader>().map((p) => ({
    name: p.name,
    id: p.playerid,
    target: `/browse/${p.playerid}`,
  }));

  return <LibraryList items={players} />;
}
