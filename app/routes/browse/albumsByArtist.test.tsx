import { createRoutesStub } from "react-router";
import userEvent from "@testing-library/user-event";
import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mock } from "vitest-mock-extended";

import AlbumsByArtist from "./albumsByArtist";
import { action as albumAction, loader as albumLoader } from "./albumsByArtist";
import lyrionClient from "~/lib/__mocks__/lyrion";
import prisma from "~/lib/__mocks__/prisma";
import type { AlbumInfo, AlbumListResponse } from "~/lib/lyrion/schemas";

vi.mock("~/lib/lyrion/client", () => ({
    getLyrionClient: () => lyrionClient,
}));
vi.mock("~/lib/prisma");

describe("AlbumsByArtist", () => {
    const mockAlbums: AlbumInfo[] = [
        {
            id: 1,
            album: "Album 1",
            artist: "Artist 1",
            artwork_track_id: '100',
        },
        {
            id: 2,
            album: "Album 2",
            artist: "Artist 2",
        },
    ];

    beforeEach(() => {
        lyrionClient.browseAlbums.mockResolvedValue({
            albums_loop: mockAlbums,
        } as unknown as AlbumListResponse);
        lyrionClient.urlForArtworkId.mockReturnValue("/artwork/123");
    });

    describe("loader", () => {
        it("should fetch albums for the given artist", async () => {
            const fakeRequest = mock<Request>();
            const loaderArgs = {
                request: fakeRequest,
                unstable_url: new URL("http://localhost/browse/artists/1/albums"),
                params: { artistId: "1" },
                unstable_pattern: "/browse/albums/:artistId",
                context: {},
            } as Parameters<typeof albumLoader>[0];

            const result = await albumLoader(loaderArgs);

            expect(result.albums).toBeDefined();
            expect(lyrionClient.browseAlbums).toHaveBeenCalledWith(1, 0, 500);
        });

        it("should handle decimal artist IDs", async () => {
            const fakeRequest = mock<Request>();
            const loaderArgs = {
                request: fakeRequest,
                unstable_url: new URL("http://localhost/browse/artists/42/albums"),
                params: { artistId: "42" },
                unstable_pattern: "/browse/albums/:artistId",
                context: {},
            } as Parameters<typeof albumLoader>[0];

            await albumLoader(loaderArgs);

            expect(lyrionClient.browseAlbums).toHaveBeenCalledWith(42, 0, 500);
        });
    });

    describe("action", () => {
        it("should create a playback item with full album info", async () => {
            const formData = new FormData();
            formData.set("id", "1");
            formData.set("album", "Album 1");
            formData.set("artist", "Artist 1");
            formData.set("artwork_track_id", "100");

            const fakeRequest = mock<Request>();
            fakeRequest.formData.mockResolvedValue(formData);

            const actionArgs = {
                request: fakeRequest,
                unstable_url: new URL("http://localhost/browse/albums/1"),
                params: { artistId: "1" },
                unstable_pattern: "/browse/albums/:artistId",
                context: {},
            } as Parameters<typeof albumAction>[0];

            const resp = await albumAction(actionArgs);

            expect(resp.status).toBe(302);
            expect(resp.headers.get("Location")).toBe("/");
            expect(prisma.playbackItem.create).toHaveBeenCalledExactlyOnceWith({
                data: {
                    title: "Album 1",
                    subtitle: "Album 1",
                    imageUrl: "/artwork/123",
                    backendUrl: "album:1",
                },
            });
        });

        it("should create a playback item without artwork when artwork_track_id is missing", async () => {
            const formData = new FormData();
            formData.set("id", "2");
            formData.set("album", "Album 2");
            formData.set("artist", "Artist 2");

            const fakeRequest = mock<Request>();
            fakeRequest.formData.mockResolvedValue(formData);

            const actionArgs = {
                request: fakeRequest,
                unstable_url: new URL("http://localhost/browse/albums/2"),
                params: { artistId: "2" },
                unstable_pattern: "/browse/albums/:artistId",
                context: {},
            } as Parameters<typeof albumAction>[0];

            const resp = await albumAction(actionArgs);

            expect(resp.status).toBe(302);
            expect(prisma.playbackItem.create).toHaveBeenCalledExactlyOnceWith({
                data: {
                    title: "Album 2",
                    subtitle: "Album 2",
                    imageUrl: undefined,
                    backendUrl: "album:2",
                },
            });
            expect(lyrionClient.urlForArtworkId).toHaveBeenCalledTimes(0)
        });

        it("should fail validation if required fields are missing", async () => {
            const formData = new FormData();
            formData.set("id", "1");
            formData.set("album", "Album 1");
            // Missing artist and artwork_track_id

            const fakeRequest = mock<Request>();
            fakeRequest.formData.mockResolvedValue(formData);

            const actionArgs = {
                request: fakeRequest,
                unstable_url: new URL("http://localhost/browse/albums/1"),
                params: { artistId: "1" },
                unstable_pattern: "/browse/albums/:artistId",
                context: {},
            } as Parameters<typeof albumAction>[0];

            await expect(albumAction(actionArgs)).rejects.toThrow();
            expect(prisma.playbackItem.create).not.toHaveBeenCalled();
        });
    });

    describe("AlbumList Component", () => {
        it("should render album list with album data", async () => {
            const Stub = createRoutesStub([
                {
                    path: "/browse/albums/:artistId",
                    Component: AlbumsByArtist,
                    loader: () => ({
                        albums: Promise.resolve(mockAlbums),
                    }),
                    action() { },
                },
            ]);

            render(<Stub initialEntries={["/browse/albums/1"]} />);

            const album1 = await waitFor(() => screen.findByText("Album 1"));
            const album2 = await screen.findByText("Album 2");
            const artist1 = await screen.findByText("Artist 1");
            const artist2 = await screen.findByText("Artist 2");

            expect(album1).toBeInTheDocument();
            expect(album2).toBeInTheDocument();
            expect(artist1).toBeInTheDocument();
            expect(artist2).toBeInTheDocument();
        });

        it("should submit album data when New button is clicked", async () => {
            const action = vi.fn();
            const Stub = createRoutesStub([
                {
                    path: "/browse/albums/:artistId",
                    Component: AlbumsByArtist,
                    loader: () => ({
                        albums: Promise.resolve(mockAlbums),
                    }),
                    action,
                },
            ]);

            render(<Stub initialEntries={["/browse/albums/1"]} />);

            const newButtons = await waitFor(() =>
                screen.getAllByRole("button", { name: /New/i })
            );

            const user = userEvent.setup();
            await user.click(newButtons[0]);

            expect(action).toHaveBeenCalled();
            const { request } = action.mock.calls[0][0];
            const formData = await request.formData();

            expect(formData.get("id")).toBe("1");
            expect(formData.get("album")).toBe("Album 1");
            expect(formData.get("artist")).toBe("Artist 1");
            expect(formData.get("artwork_track_id")).toBe("100");
        });

        it("should render album artwork images", async () => {
            const Stub = createRoutesStub([
                {
                    path: "/browse/albums/:artistId",
                    Component: AlbumsByArtist,
                    loader: () => ({
                        albums: Promise.resolve(mockAlbums),
                    }),
                    action() { },
                },
            ]);

            render(<Stub initialEntries={["/browse/albums/1"]} />);

            const images = await waitFor(() => screen.getAllByRole("img"));

            // Should have images for both albums
            expect(images.length).toBeGreaterThanOrEqual(2);
            expect(images[0]).toHaveAttribute("alt", "Album 1");
            expect(images[1]).toHaveAttribute("alt", "Album 2");
        });
    });
});
