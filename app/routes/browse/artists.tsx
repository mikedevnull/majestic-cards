import { Await, Link, useAsyncValue } from "react-router";
import { getLyrionClient } from "../../lib/lyrion/client";
import type { Route } from "../browse/+types/artists";
import artistSvg from "../../assets/artist.svg";
import React from "react";
import type { ArtistInfo } from "~/lib/lyrion/schemas";

export async function loader() {
    const artists = getLyrionClient()
        .browseArtists(0, 500)
        .then((result) => result.artists_loop);
    return { artists };
}

function ArtistList() {
    const artists = useAsyncValue() as ArtistInfo[];
    return (
        <ul className="list  bg-base-100 rounded-box shadow-md">
            {artists.map((a) => (
                <li className="list-row hover:bg-base-200" key={a.id}>
                    <div className="size-8 relative">
                        <img className="rounded-sm" src={artistSvg} alt="" />
                    </div>
                    <Link to={`${a.id}`} className="self-center">
                        <div>{a.artist}</div>
                        {/* <div className="text-xs uppercase font-semibold opacity-60">{a.subtitle}</div> */}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function BrowseArtist({ loaderData }: Route.ComponentProps) {
    const { artists } = loaderData;
    return (
        <React.Suspense
            fallback={
                <div className="w-full flex pt-12">
                    <span className="mx-auto loading loading-dots loading-xl" />
                </div>
            }
        >
            <Await resolve={artists}>
                <ArtistList></ArtistList>
            </Await>
        </React.Suspense>
    );
}
