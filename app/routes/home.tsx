import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import prisma from "../lib/prisma";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const playbackItems = await prisma.playbackItem.findMany();
  return { playbackItems };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { playbackItems } = loaderData;
  return <ul>{playbackItems.map((i) => <li key={i.id}>{i.title}</li>)}</ul>
}
