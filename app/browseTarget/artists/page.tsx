import Link from "next/link";
import { getLyrionClient } from "../../lib/lyrion/client";
import Image from 'next/image'

export async function generateStaticParams() {
  return [{ byType: 'artist' }]
}

type BrowseableItem = {
  title: string,
  subtitle?: string,
  id: string,
  imageUrl?: string
};

async function getArtists(): Promise<Array<BrowseableItem>> {
  'use cache'
  // very poor mans implementation, replace with something more battle tested like tanstack query
  const client = getLyrionClient()
  let artists: BrowseableItem[] = [];
  let total: number | undefined = undefined;

  while (!total || artists.length < total) {
    const next = await client.browseArtists(artists.length, 100);
    if (!total) {
      total = next.count
    }
    const moreArtists = next.artists_loop.map((a) => ({ title: a.artist, id: a.id.toString() }));
    artists = artists.concat(moreArtists);
    if (moreArtists.length === 0) {
      break;
    }
  }

  return artists;
}

export default async function BrowseTarget() {
  const artists = await getArtists()
  return (
    <>
      <ul className="list  bg-base-100 rounded-box shadow-md">
        {artists.map((a) =>
          <li className="list-row hover:bg-base-200" key={a.id}>

            <div className="size-8 relative"><Image className="rounded-sm" src="/artist.svg" fill={true} alt="" /></div>
            <Link href={`artists/${a.id}`} className="self-center">
              <div>{a.title}</div>
              <div className="text-xs uppercase font-semibold opacity-60">{a.subtitle}</div>
            </Link>
          </li>
        )
        }
      </ul >
    </>

  );
}
