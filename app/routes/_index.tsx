import type { MetaFunction } from "react-router";
import { createSearchParams, useLoaderData, useNavigate } from "react-router";
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
  const navigate = useNavigate();

  if (!activeCard) {
    return <Card active={false} title="No active card in reader" />;
  } else if (!activeCard.data) {
    const action = {
      title: "Add",
      onClick: () =>
        navigate(
          {
            pathname: "addCard",
            search: createSearchParams({ id: activeCard.id }).toString(),
          },
          {}
        ),
    };
    return (
      <Card active={true} action={action} title={"Unknown card in reader"} />
    );
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
