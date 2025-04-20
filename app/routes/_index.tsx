import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card } from "~/components/card";

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

export const loader: LoaderFunction = async (): Promise<{
  activeCard?: Card;
}> => {
  return { activeCard: undefined };
};

export default function CurrentCardDisplay() {
  const { activeCard } = useLoaderData<typeof loader>();
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
