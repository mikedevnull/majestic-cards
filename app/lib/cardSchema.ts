import { z } from "zod";

const cardDataSchema = z.object({
  title: z.string(),
  image: z.string().optional(),
});

export const cardSchema = z.object({
  id: z.string(),
  data: cardDataSchema.optional(),
});
export type Card = z.infer<typeof cardSchema>;

export const activeCardPayloadSchema = z.object({
  activeCard: cardSchema.optional(),
});

export type ActiveCardPayload = z.infer<typeof activeCardPayloadSchema>;
