import type { MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { Card } from "~/components/card";
import { activeCardChanged } from "~/lib/activeCard.server";
import { useActiveCardUpdateStream } from "./api.activeCard";
import { ActiveCardPayload } from "~/lib/cardSchema";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type CardData = { title: string; image?: string };

type Card = {
  id: string;
  data?: CardData;
};

export const loader = async (): Promise<ActiveCardPayload> => {
  const activeCard = activeCardChanged.getValue();
  return { activeCard };
};

export default function CurrentCardDisplay() {
  const loaderData = useLoaderData<typeof loader>();
  const activeCard = (useActiveCardUpdateStream() ?? loaderData).activeCard;

  if (!activeCard) {
    return <Card active={false} title="No active card in reader" />;
  } else {
    return (
      <Card
        active={true}
        title={activeCard.data?.title || "Unknown card in reader"}
        image={activeCard.data?.image}
      />
    );
  }
}
