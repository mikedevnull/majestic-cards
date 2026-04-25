import Link from "next/link";

export default function EditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="flex-1 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="btn btn-ghost mb-6">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold mb-8">Edit Playback Item</h1>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="alert alert-info">
              <span>Edit page coming soon for item ID: {params.id}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
