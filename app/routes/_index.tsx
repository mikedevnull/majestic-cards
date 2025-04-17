import type { MetaFunction } from "@remix-run/node";
import { Card } from "~/components/card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// export const loader: LoaderFunction = async ({ request }) => {};

export default function Index() {
  return <Card active={false} title="No active card in reader" />;
}
