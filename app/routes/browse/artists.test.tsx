import { createRoutesStub } from "react-router";
import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";

import BrowseArtist from "./artists";
import { loader as artistLoader } from "./artists";
import lyrionClient from "~/lib/__mocks__/lyrion";
import type { ArtistInfo, ArtistListResponse } from "~/lib/lyrion/schemas";

vi.mock("~/lib/lyrion/client", () => ({
    getLyrionClient: () => lyrionClient,
}));

describe("Artists Browse", () => {
    const mockArtists: ArtistInfo[] = [
        {
            id: 1,
            artist: "Artist One",
            textkey: "A"
        },
        {
            id: 2,
            artist: "Artist Two",
            textkey: "A"
        },
        {
            id: 3,
            artist: "Artist Three",
            textkey: "A"
        },
    ];

    beforeEach(() => {
        lyrionClient.browseArtists.mockResolvedValue({
            artists_loop: mockArtists,
        } as ArtistListResponse);
    });

    describe("loader", () => {
        it("should fetch artists from lyrion client", async () => {
            const result = await artistLoader();

            expect(result.artists).toBeDefined();
            expect(lyrionClient.browseArtists).toHaveBeenCalledWith(0, 500);
        });
    });

    describe("ArtistList Component", () => {
        it("should render all artists in the list", async () => {
            const Stub = createRoutesStub([
                {
                    path: "/browse/artists",
                    Component: BrowseArtist,
                    loader: () => ({
                        artists: Promise.resolve(mockArtists),
                    }),
                },
            ]);

            render(<Stub initialEntries={["/browse/artists"]} />);

            const artist1 = await waitFor(() => screen.findByText("Artist One"));
            const artist2 = await screen.findByText("Artist Two");
            const artist3 = await screen.findByText("Artist Three");

            expect(artist1).toBeInTheDocument();
            expect(artist2).toBeInTheDocument();
            expect(artist3).toBeInTheDocument();
        });

        it("should render artist links with correct href", async () => {
            const Stub = createRoutesStub([
                {
                    path: "/browse/artists",
                    Component: BrowseArtist,
                    loader: () => ({
                        artists: Promise.resolve(mockArtists),
                    }),
                },
            ]);

            render(<Stub initialEntries={["/browse/artists"]} />);

            const links = await waitFor(() => screen.getAllByRole("link"));

            expect(links).toHaveLength(3);
            expect(links[0]).toHaveAttribute("href", "/browse/artists/1");
            expect(links[1]).toHaveAttribute("href", "/browse/artists/2");
            expect(links[2]).toHaveAttribute("href", "/browse/artists/3");
        });

        it("should handle empty artist list", async () => {
            const Stub = createRoutesStub([
                {
                    path: "/browse/artists",
                    Component: BrowseArtist,
                    loader: () => ({
                        artists: Promise.resolve([]),
                    }),
                },
            ]);

            render(<Stub initialEntries={["/browse/artists"]} />);

            const links = await waitFor(() => screen.queryAllByRole("link"));

            expect(links).toHaveLength(0);
        });
    });
});
