import { createRoutesStub } from "react-router";
import {
    render,
    screen,
} from "@testing-library/react";
import CardList, { loader as cardListLoader } from "./card-list";
import prisma from "~/lib/__mocks__/prisma";

vi.mock("~/lib/prisma");

describe("Card list", () => {
    it("renders an empty state when there are no playback items", async () => {
        const Stub = createRoutesStub([
            {
                path: "/card-list",
                Component: CardList,
                loader: () => {
                    return { playbackItems: [] };
                },
            },
        ]);

        render(<Stub initialEntries={["/card-list"]} />);

        expect(await screen.findByText(/No playback items yet/i)).toBeInTheDocument();
    });

    it("renders playback items and edit links", async () => {
        const Stub = createRoutesStub([
            {
                path: "/card-list",
                Component: CardList,
                loader: () => {
                    return {
                        playbackItems: [
                            {
                                id: 1,
                                title: "Song One",
                                subtitle: "First song",
                                backendUrl: "album:1",
                                imageUrl: "/artwork/1",
                                triggerId: null,
                            },
                            {
                                id: 2,
                                title: "Song Two",
                                subtitle: "Second song",
                                backendUrl: null,
                                imageUrl: null,
                                triggerId: null,
                            },
                        ],
                    };
                },
            },
        ]);

        render(<Stub initialEntries={["/card-list"]} />);

        expect(await screen.findByText("Song One")).toBeInTheDocument();
        expect(screen.getByText("Song Two")).toBeInTheDocument();
        const editLinks = screen.getAllByRole("link", { name: /edit/i });
        expect(editLinks).toHaveLength(2);
        expect(editLinks[0]).toHaveAttribute("href", "/editCard/1");
        expect(editLinks[1]).toHaveAttribute("href", "/editCard/2");
    });

    describe("loader", () => {
        it("loads playback items from the database", async () => {
            const playbackItems = [
                {
                    id: 1,
                    title: "Loaded Song",
                    subtitle: "Loaded subtitle",
                    backendUrl: "album:123",
                    imageUrl: "/api/artwork/123",
                    triggerId: null,
                },
            ];

            prisma.playbackItem.findMany.mockResolvedValue(playbackItems);
            const resp = await cardListLoader();

            expect(resp).toStrictEqual({ playbackItems });
            expect(prisma.playbackItem.findMany).toHaveBeenCalledOnce();
        });
    });
});
