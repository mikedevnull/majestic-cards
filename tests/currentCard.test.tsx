import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import CurrentCardDisplay from "~/routes/_index";

test("Renders if there's currently no active card", async () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: CurrentCardDisplay,
      loader() {
        return { activeCard: undefined };
      },
    },
  ]);

  render(<RemixStub />);

  await waitFor(() => screen.findByText("No active card in reader"));
});
