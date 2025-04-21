import { BehaviorSubject } from "rxjs";
import { z } from "zod";

type CardData = { title: string; image?: string };

type Card = {
  id: string;
  data?: CardData;
};
export const activeCardChanged = new BehaviorSubject<Card | undefined>(
  undefined
);

export const cardChangeTriggerSchema = z.object({
  id: z.string().optional(),
});
type CardChangePayload = z.infer<typeof cardChangeTriggerSchema>;

export function changeActiveCard(card: CardChangePayload) {
  const id = card.id;
  if (id === undefined) {
    activeCardChanged.next(undefined);
    return;
  }
  activeCardChanged.next({
    id,
  });
}
