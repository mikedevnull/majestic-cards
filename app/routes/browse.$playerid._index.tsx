import { useParams } from "@remix-run/react";
import { LibraryList } from "~/components/libraryList";

export default function Index() {
  const params = useParams();
  const items = [
    {
      id: "music",
      name: "My Music",
      target: `/browse/${params.playerid}/music/`,
    },
    { id: "app", name: "Apps", target: `/browse/${params.playerid}/apps` },
  ];

  return <LibraryList items={items} />;
}
