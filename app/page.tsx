import Image from "next/image";
import Link from "next/link";
import { prisma } from "./lib/prisma";

async function getPlaybackItems() {
  try {
    return await prisma.playbackItem.findMany();
  } catch (error) {
    console.error("Error fetching playback items:", error);
    return [];
  }
}

export default async function Home() {
  const items = await getPlaybackItems();

  return (
    <main className="flex-1 w-full">
      <div className="fab">
        <Link href="/browseTarget/artists" className="btn btn-lg btn-circle btn-primary">
          <svg
            aria-label="New"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Playback Items</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/60">
              No playback items yet. Add one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                {item.imageUrl && (
                  <figure className="h-48 relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title">{item.title}</h2>
                  {item.backendUrl && (
                    <p className="text-sm text-base-content/70 truncate">
                      {item.backendUrl}
                    </p>
                  )}
                  <div className="card-actions justify-end mt-4">
                    <Link
                      href={`/edit/${item.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
