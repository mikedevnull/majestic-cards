import { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import {
  cardChangeTriggerSchema,
  changeActiveCard,
} from "~/lib/activeCard.server";

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
