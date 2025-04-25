import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { eventStream } from "remix-utils/sse/server";

import {
  activeCardChanged,
  cardChangeTriggerSchema,
  changeActiveCard,
} from "~/lib/activeCard.server";
import { useEventSource } from "remix-utils/sse/react";
import { ActiveCardPayload, activeCardPayloadSchema } from "~/lib/cardSchema";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    switch (request.method) {
      case "PUT": {
        const raw = await request.json();
        const data = cardChangeTriggerSchema.parse(raw);
        changeActiveCard(data);
        return new Response("Card changed", { status: 200 });
      }
    }
    return new Response("Bad request", { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return new Response("Bad data", { status: 400 });
    }

    return new Response("Server error", { status: 500 });
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    const subscription = activeCardChanged.subscribe((activeCard) => {
      if (activeCard) {
        const eventData = JSON.stringify({ activeCard });
        send({ event: "activeCard", data: eventData });
      } else {
        send({
          event: "activeCard",
          data: JSON.stringify({ activeCard: undefined }),
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  });
}

export function useActiveCardUpdateStream(): ActiveCardPayload | undefined {
  const eventSourceData = useEventSource("/api/activeCard", {
    event: "activeCard",
  });
  try {
    if (eventSourceData) {
      const parsed = JSON.parse(eventSourceData);
      const eventData = activeCardPayloadSchema.parse(parsed);
      return eventData;
    }
  } catch (error) {
    console.error("Error parsing event data", error);
  }
}
