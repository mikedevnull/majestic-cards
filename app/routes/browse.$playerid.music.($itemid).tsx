import { useParams } from "@remix-run/react";

export default function Index() {
  const params = useParams();

  return (
    <>
      <span>Placeolder: {params.playerid}</span>
      <span>{params.itemid}</span>
    </>
  );
}
