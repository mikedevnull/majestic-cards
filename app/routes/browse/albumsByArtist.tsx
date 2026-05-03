import type { Route } from "./+types/albumsByArtist";
import albumImage from "../../assets/album.png";
import { getLyrionClient } from "../../lib/lyrion/client";
import { Await, redirect, useAsyncValue, useSubmit } from "react-router";
import { AlbumInfoSchema, type AlbumInfo } from "../../lib/lyrion/schemas";
import React, { useCallback } from "react";
import prisma from "../../lib/prisma";
import { z } from "zod";

export async function loader({ params }: Route.LoaderArgs) {
    const artistId = parseInt(params.artistId)
    const artists = getLyrionClient()
        .browseAlbums(artistId, 0, 500)
        .then((result) => result.albums_loop);
    return { albums: artists };
}

const NewFromAlbumInfoRequest = z.object({
    ...AlbumInfoSchema.shape,
    id: z.coerce.number()
});

export async function action({
    request,
}: Route.ActionArgs) {
    const formData = await request.formData().then((form) => Object.fromEntries(form));
    const newRequest = NewFromAlbumInfoRequest.parse(formData);
    const client = getLyrionClient();
    const imageUrl = newRequest.artwork_track_id ? client.urlForArtworkId(newRequest.artwork_track_id) : undefined
    const data = {
        title: newRequest.album,
        subtitle: newRequest.album,
        imageUrl,
        backendUrl: `album:${newRequest.id}`
    }
    await prisma.playbackItem.create({ data })

    return redirect("/")
}

function AlbumList() {
    const albums = useAsyncValue() as AlbumInfo[];
    const submit = useSubmit();
    const createNewCallback = useCallback((data: AlbumInfo) => { submit(data, { method: "post" },) }, [])


    return <ul className="list bg-base-100 rounded-box shadow-md">
        {albums.map((a) => {
            const artwork = (
                <img
                    className="rounded-box size-10"
                    sizes="10vw"
                    alt={a.album}
                    src={a.artwork_track_id ? `/api/albumArtwork/${a.artwork_track_id}` : albumImage}
                />
            );

            const searchParams = new URLSearchParams()
            searchParams.append("target", `album:${a.id}`);

            return (
                <li className="list-row" key={a.id}>
                    <div className="size-10 relative">{artwork}</div>
                    <div>
                        <div>{a.album}</div>
                        <div className="text-xs uppercase font-semibold opacity-60">
                            {a.artist}
                        </div>
                    </div>
                    <button onClick={() => createNewCallback(a)} className="btn btn-primary">
                        New
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                        >
                            <path d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 10.828a.75.75 0 0 1 0 1.061L6.11 12.95a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10.766 7.51a.75.75 0 0 0-1.37.365l-.492 6.861a.75.75 0 0 0 1.204.65l1.043-.799.985 3.678a.75.75 0 0 0 1.45-.388l-.978-3.646 1.292.204a.75.75 0 0 0 .74-1.16l-3.874-5.764Z" />
                        </svg>
                    </button>
                </li>
            );
        }
        )}
    </ul>
}



export default function AlbumsByArtist({
    loaderData }: Route.ComponentProps) {
    const { albums } = loaderData;
    return (
        <React.Suspense
            fallback={
                <div className="w-full flex pt-12">
                    <span className="mx-auto loading loading-dots loading-xl" />
                </div>
            }
        >
            <Await resolve={albums}>
                <AlbumList />
            </Await>
        </React.Suspense>
    );
}
