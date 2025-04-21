import { createRoutesStub } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import CurrentCardDisplay from "~/routes/_index";

test("Renders if there's currently no active card", async () => {
  const RemixStub = createRoutesStub([
    {
      path: "/",
      Component: CurrentCardDisplay,
      loader() {
        return { activeCard: undefined };
      },
    },
  ]);

  const result = render(<RemixStub />);

  await waitFor(() => screen.findByText("No active card in reader"));
  expect(result.container).toMatchSnapshot();
});

test("Renders placeholder text and image for unkown cards without data", async () => {
  const RemixStub = createRoutesStub([
    {
      path: "/",
      Component: CurrentCardDisplay,
      loader() {
        return { activeCard: { id: "123-456-789" } };
      },
    },
  ]);

  const result = render(<RemixStub />);
  await waitFor(() => screen.findByText("Unknown card in reader"));
  expect(result.container).toMatchSnapshot();
});
