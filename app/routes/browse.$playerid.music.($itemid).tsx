import { useParams } from "react-router";

export default function Index() {
  const params = useParams();

  return (
    <>
      <span>Placeolder: {params.playerid}</span>
      <span>{params.itemid}</span>
    </>
  );
}
